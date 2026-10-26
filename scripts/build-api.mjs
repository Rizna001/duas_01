import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';

const root = process.cwd();
const dataDirectory = path.join(root, 'src', 'data');
const categoryFiles = [
  'duas.json',
  'expanded-duas.json',
  'additional-duas.json',
  'prayer-duas.json',
  'important-texts.json',
  'allRabbanaCategory.json',
  'allSalawatsCategory.json',
  'prophet-names-category.json',
];

async function readJson(fileName) {
  return JSON.parse(await readFile(path.join(dataDirectory, fileName), 'utf8'));
}

async function readTypeScriptExports(fileName) {
  const source = await readFile(path.join(dataDirectory, fileName), 'utf8');
  const result = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
    fileName,
    reportDiagnostics: true,
  });
  const errors = (result.diagnostics ?? []).filter(
    diagnostic => diagnostic.category === ts.DiagnosticCategory.Error,
  );
  if (errors.length) {
    throw new Error(
      `Could not compile ${fileName}: ${errors.map(error => ts.flattenDiagnosticMessageText(error.messageText, '\n')).join('; ')}`,
    );
  }

  const exports = {};
  vm.runInNewContext(result.outputText, { exports }, { filename: fileName, timeout: 1000 });
  return exports;
}

function validateCategory(category, seenCategoryIds, seenDuaIds) {
  if (!category || typeof category !== 'object' || !category.id) {
    throw new Error('Every category must have a non-empty id.');
  }
  if (seenCategoryIds.has(category.id)) {
    throw new Error(`Duplicate category id: ${category.id}`);
  }
  seenCategoryIds.add(category.id);

  for (const field of ['icon', 'color', 'gradient', 'bg', 'border', 'text', 'name', 'duas']) {
    if (!(field in category)) {
      throw new Error(`Category ${category.id} is missing "${field}".`);
    }
  }
  if (!category.name?.en || !Array.isArray(category.duas)) {
    throw new Error(`Category ${category.id} needs an English name and a duas array.`);
  }
  for (const language of languageCodes) {
    if (!category.name[language]) {
      throw new Error(`Category ${category.id} is missing its ${language} name.`);
    }
  }

  for (const dua of category.duas) {
    if (!dua || typeof dua !== 'object' || !dua.id) {
      throw new Error(`Category ${category.id} contains a dua without an id.`);
    }
    if (seenDuaIds.has(dua.id)) {
      throw new Error(`Duplicate dua id: ${dua.id}`);
    }
    seenDuaIds.add(dua.id);

    const times = dua.times ?? dua.recite_times;
    if (
      !dua.title?.en ||
      !dua.arabic ||
      !dua.translation?.en ||
      !dua.reference ||
      !Number.isInteger(times) ||
      times < 1
    ) {
      throw new Error(`Dua ${dua.id} in ${category.id} is missing required content or has an invalid recitation count.`);
    }
    for (const language of languageCodes) {
      if (!dua.title[language] || !dua.translation[language]) {
        throw new Error(`Dua ${dua.id} in ${category.id} is missing its ${language} title or translation.`);
      }
    }
    dua.times = times;
    delete dua.recite_times;
  }
}

const primaryData = await readJson('duas.json');
const languages = primaryData.languages;
if (!Array.isArray(languages) || languages.length === 0) {
  throw new Error('The primary dua data file must define supported languages.');
}
const languageCodes = languages.map(language => language.code);
if (new Set(languageCodes).size !== languageCodes.length) {
  throw new Error('The supported language list contains duplicate language codes.');
}

const sourceFiles = await Promise.all(categoryFiles.map(readJson));
const categories = sourceFiles.flatMap(data => {
  if (!Array.isArray(data.categories)) {
    throw new Error('Every category data file must contain a categories array.');
  }
  return data.categories;
});

const categoryIds = new Set();
const duaIds = new Set();
categories.forEach(category => validateCategory(category, categoryIds, duaIds));

const [
  completeLists,
  rabbanaData,
  salawatData,
  prophetsData,
  importantTextData,
  comprehensiveDuas,
] = await Promise.all([
  readTypeScriptExports('completeLists.ts'),
  readTypeScriptExports('allRabbanaDuas.ts'),
  readTypeScriptExports('allSalawats.ts'),
  readTypeScriptExports('prophetsWithDuas.ts'),
  readTypeScriptExports('importantTexts.ts'),
  readTypeScriptExports('comprehensiveDuas.ts'),
]);

const collections = {
  asma_ul_husna: completeLists.asmaUlHusna,
  asma_ul_anbiya: completeLists.asmaUlAnbiya,
  rabbana_duas: completeLists.rabbanaDuas,
  all_rabbana_duas: rabbanaData.allRabbanaDuas,
  comprehensive_rabbana_duas: comprehensiveDuas.allRabbanaDuas,
  all_salawats: salawatData.allSalawats,
  prophets_with_duas: prophetsData.prophetsWithDuas,
  prophet_names_with_meanings: prophetsData.prophetNamesWithMeanings,
  famous_salawat: importantTextData.famousSalawat,
  qaseedatul_burdah_chapter_1: importantTextData.qaseedatulBurdahChapter1,
  additional_important_texts: importantTextData.additionalImportantTexts,
};

for (const [name, value] of Object.entries(collections)) {
  if (value === undefined || value === null) {
    throw new Error(`Supplementary collection "${name}" could not be loaded.`);
  }
}
for (const [name, value] of Object.entries(collections)) {
  if (name !== 'qaseedatul_burdah_chapter_1' && !Array.isArray(value)) {
    throw new Error(`Supplementary collection "${name}" must be an array.`);
  }
}
for (const [name, expectedCount] of [
  ['asma_ul_husna', 99],
  ['asma_ul_anbiya', 25],
  ['rabbana_duas', 40],
  ['all_rabbana_duas', 40],
  ['prophets_with_duas', 25],
  ['prophet_names_with_meanings', 25],
]) {
  if (!Array.isArray(collections[name]) || collections[name].length !== expectedCount) {
    throw new Error(`Expected ${expectedCount} records in ${name}; received ${collections[name]?.length ?? 'no data'}.`);
  }
}
if (!Array.isArray(collections.qaseedatul_burdah_chapter_1.verses)) {
  throw new Error('The Qaseedatul Burdah collection must include its verses array.');
}

const api = {
  api_version: '1.0.0',
  description: 'Islamic duas, adhkar, and supplementary collections',
  total_categories: categories.length,
  total_duas: [...categories].reduce((count, category) => count + category.duas.length, 0),
  supported_languages: languages.map(language => language.code),
  languages,
  categories,
  collections,
};
const index = {
  api_version: api.api_version,
  description: api.description,
  base_path: '/api/v1',
  endpoints: {
    index: '/api/v1/index.json',
    all_duas: '/api/v1/duas.json',
  },
  total_categories: api.total_categories,
  total_duas: api.total_duas,
  supported_languages: api.supported_languages,
  categories: categories.map(category => ({
    id: category.id,
    name: category.name,
    icon: category.icon,
    duas_count: category.duas.length,
  })),
  collections: Object.fromEntries(
    Object.entries(collections).map(([name, value]) => [
      name,
      Array.isArray(value) ? value.length : 1,
    ]),
  ),
};

async function writeJson(filePath, value) {
  await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

await writeJson(path.join(dataDirectory, 'catalog.json'), {
  categories,
  languages,
});
await writeJson(path.join(root, 'public', 'api', 'v1', 'duas.json'), api);
await writeJson(path.join(root, 'public', 'api', 'v1', 'index.json'), index);

console.log(
  `Validated and generated catalog: ${api.total_categories} categories, ${api.total_duas} duas, ${Object.keys(collections).length} supplementary collections.`,
);
