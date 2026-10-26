import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useBookmarks } from '../contexts/BookmarksContext';
import { ReminderDay, useNotifications } from '../contexts/NotificationsContext';
import AudioPlayer from './AudioPlayer';

export default function DuaDetail({
  dua,
  category,
  language,
  onBack,
}: {
  dua: any;
  category: any;
  language: string;
  onBack: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('lg');
  const [bookmarkAnimating, setBookmarkAnimating] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [reminderTime, setReminderTime] = useState('08:00');
  const [reminderDays, setReminderDays] = useState<ReminderDay[]>([
    (['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as ReminderDay[])[new Date().getDay()],
  ]);
  const [reminderSound, setReminderSound] = useState('adhan');
  const [reminderError, setReminderError] = useState('');
  const { isDark } = useTheme();
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const { addReminder, sounds } = useNotifications();

  const arabicFontSize = {
    sm: 'text-2xl',
    md: 'text-3xl',
    lg: 'text-4xl',
    xl: 'text-5xl',
  };

  const handleCopy = () => {
    const text = `${dua.arabic}\n\n${dua.translation[language] || dua.translation.en}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBookmark = () => {
    setBookmarkAnimating(true);
    toggleBookmark({
      id: dua.id,
      categoryId: category.id,
      title: dua.title,
      arabic: dua.arabic,
      translation: dua.translation,
      reference: dua.reference,
      times: dua.times,
      bookmarkedAt: Date.now(),
    });
    setTimeout(() => setBookmarkAnimating(false), 400);
  };

  const handleSetReminder = () => {
    setShowReminderModal(true);
  };

  const dayOptions: { value: ReminderDay; labels: Record<string, string> }[] = [
    { value: 'mon', labels: { en: 'Monday', ar: 'الاثنين', ur: 'پیر', fr: 'Lundi', tr: 'Pazartesi', id: 'Senin', bn: 'সোমবার', ms: 'Isnin', ta: 'திங்கள்', ml: 'തിങ്കളാഴ്ച' } },
    { value: 'tue', labels: { en: 'Tuesday', ar: 'الثلاثاء', ur: 'منگل', fr: 'Mardi', tr: 'Salı', id: 'Selasa', bn: 'মঙ্গলবার', ms: 'Selasa', ta: 'செவ்வாய்', ml: 'ചൊവ്വാഴ്ച' } },
    { value: 'wed', labels: { en: 'Wednesday', ar: 'الأربعاء', ur: 'بدھ', fr: 'Mercredi', tr: 'Çarşamba', id: 'Rabu', bn: 'বুধবার', ms: 'Rabu', ta: 'புதன்', ml: 'ബുധനാഴ്ച' } },
    { value: 'thu', labels: { en: 'Thursday', ar: 'الخميس', ur: 'جمعرات', fr: 'Jeudi', tr: 'Perşembe', id: 'Kamis', bn: 'বৃহস্পতিবার', ms: 'Khamis', ta: 'வியாழன்', ml: 'വ്യാഴാഴ്ച' } },
    { value: 'fri', labels: { en: 'Friday', ar: 'الجمعة', ur: 'جمعہ', fr: 'Vendredi', tr: 'Cuma', id: 'Jumat', bn: 'শুক্রবার', ms: 'Jumaat', ta: 'வெள்ளி', ml: 'വെള്ളിയാഴ്ച' } },
    { value: 'sat', labels: { en: 'Saturday', ar: 'السبت', ur: 'ہفتہ', fr: 'Samedi', tr: 'Cumartesi', id: 'Sabtu', bn: 'শনিবার', ms: 'Sabtu', ta: 'சனி', ml: 'ശനിയാഴ്ച' } },
    { value: 'sun', labels: { en: 'Sunday', ar: 'الأحد', ur: 'اتوار', fr: 'Dimanche', tr: 'Pazar', id: 'Minggu', bn: 'রবিবার', ms: 'Ahad', ta: 'ஞாயிறு', ml: 'ഞായറാഴ്ച' } },
  ];

  const reminderLabels: Record<string, Record<string, string>> = {
    en: { title: 'Set Reminder', description: 'Choose the days and local time for this weekly reminder.', name: 'Title', days: 'Repeat on', time: 'Reminder time', sound: 'Sound', multiple: 'Create another reminder to schedule this dua at a different time.', browser: 'Keep this app open in a browser tab for reminders to run.', selectDay: 'Select at least one day.', permission: 'Allow browser notifications to save a reminder.', cancel: 'Cancel', save: 'Set Reminder' },
    ar: { title: 'تعيين تذكير', description: 'اختر الأيام والوقت المحلي لهذا التذكير الأسبوعي.', name: 'العنوان', days: 'التكرار في', time: 'وقت التذكير', sound: 'الصوت', multiple: 'أنشئ تذكيراً آخر لجدولة هذا الدعاء في وقت مختلف.', browser: 'أبقِ التطبيق مفتوحاً في علامة تبويب بالمتصفح لتعمل التذكيرات.', selectDay: 'اختر يوماً واحداً على الأقل.', permission: 'اسمح بإشعارات المتصفح لحفظ التذكير.', cancel: 'إلغاء', save: 'تعيين تذكير' },
    ur: { title: 'یاد دہانی سیٹ کریں', description: 'اس ہفتہ وار یاد دہانی کے لیے دن اور مقامی وقت منتخب کریں۔', name: 'عنوان', days: 'ان دنوں میں دہرائیں', time: 'یاد دہانی کا وقت', sound: 'آواز', multiple: 'اس دعا کو دوسرے وقت پر شیڈول کرنے کے لیے ایک اور یاد دہانی بنائیں۔', browser: 'یاد دہانیاں چلانے کے لیے ایپ کو براؤزر ٹیب میں کھلا رکھیں۔', selectDay: 'کم از کم ایک دن منتخب کریں۔', permission: 'یاد دہانی محفوظ کرنے کے لیے براؤزر کی اطلاعات کی اجازت دیں۔', cancel: 'منسوخ کریں', save: 'یاد دہانی سیٹ کریں' },
    fr: { title: 'Définir un rappel', description: 'Choisissez les jours et l’heure locale de ce rappel hebdomadaire.', name: 'Titre', days: 'Répéter le', time: 'Heure du rappel', sound: 'Son', multiple: 'Créez un autre rappel pour programmer cette invocation à une autre heure.', browser: 'Gardez l’application ouverte dans un onglet pour que les rappels fonctionnent.', selectDay: 'Sélectionnez au moins un jour.', permission: 'Autorisez les notifications du navigateur pour enregistrer un rappel.', cancel: 'Annuler', save: 'Définir le rappel' },
    tr: { title: 'Hatırlatıcı Ayarla', description: 'Bu haftalık hatırlatıcı için günleri ve yerel saati seçin.', name: 'Başlık', days: 'Şu günlerde tekrarla', time: 'Hatırlatma saati', sound: 'Ses', multiple: 'Bu duayı başka bir saate planlamak için yeni bir hatırlatıcı oluşturun.', browser: 'Hatırlatıcıların çalışması için uygulamayı tarayıcı sekmesinde açık tutun.', selectDay: 'En az bir gün seçin.', permission: 'Hatırlatıcıyı kaydetmek için tarayıcı bildirimlerine izin verin.', cancel: 'İptal', save: 'Hatırlatıcı Ayarla' },
    id: { title: 'Atur Pengingat', description: 'Pilih hari dan waktu lokal untuk pengingat mingguan ini.', name: 'Judul', days: 'Ulangi pada', time: 'Waktu pengingat', sound: 'Suara', multiple: 'Buat pengingat lain untuk menjadwalkan doa ini pada waktu berbeda.', browser: 'Biarkan aplikasi terbuka di tab browser agar pengingat berjalan.', selectDay: 'Pilih setidaknya satu hari.', permission: 'Izinkan notifikasi browser untuk menyimpan pengingat.', cancel: 'Batal', save: 'Atur Pengingat' },
    bn: { title: 'রিমাইন্ডার সেট করুন', description: 'এই সাপ্তাহিক রিমাইন্ডারের জন্য দিন ও স্থানীয় সময় বেছে নিন।', name: 'শিরোনাম', days: 'যে দিনগুলোতে পুনরাবৃত্তি হবে', time: 'রিমাইন্ডারের সময়', sound: 'শব্দ', multiple: 'এই দোয়াটি অন্য সময়ে নির্ধারণ করতে আরেকটি রিমাইন্ডার তৈরি করুন।', browser: 'রিমাইন্ডার চালু রাখতে ব্রাউজার ট্যাবে অ্যাপটি খোলা রাখুন।', selectDay: 'অন্তত একটি দিন নির্বাচন করুন।', permission: 'রিমাইন্ডার সংরক্ষণ করতে ব্রাউজার বিজ্ঞপ্তির অনুমতি দিন।', cancel: 'বাতিল', save: 'রিমাইন্ডার সেট করুন' },
    ms: { title: 'Tetapkan Peringatan', description: 'Pilih hari dan waktu tempatan untuk peringatan mingguan ini.', name: 'Tajuk', days: 'Ulang pada', time: 'Masa peringatan', sound: 'Bunyi', multiple: 'Cipta peringatan lain untuk menjadualkan doa ini pada waktu berbeza.', browser: 'Biarkan aplikasi terbuka dalam tab pelayar agar peringatan berfungsi.', selectDay: 'Pilih sekurang-kurangnya satu hari.', permission: 'Benarkan pemberitahuan pelayar untuk menyimpan peringatan.', cancel: 'Batal', save: 'Tetapkan Peringatan' },
    ta: { title: 'நினைவூட்டலை அமை', description: 'இந்த வாராந்திர நினைவூட்டலுக்கான நாட்களையும் உள்ளூர் நேரத்தையும் தேர்ந்தெடுக்கவும்.', name: 'தலைப்பு', days: 'இந்த நாட்களில் மீண்டும்', time: 'நினைவூட்டல் நேரம்', sound: 'ஒலி', multiple: 'இந்த துஆவை வேறு நேரத்தில் அமைக்க மற்றொரு நினைவூட்டலை உருவாக்கவும்.', browser: 'நினைவூட்டல்கள் இயங்க பயன்பாட்டை உலாவி தாவலில் திறந்து வைத்திருக்கவும்.', selectDay: 'குறைந்தது ஒரு நாளையாவது தேர்ந்தெடுக்கவும்.', permission: 'நினைவூட்டலைச் சேமிக்க உலாவி அறிவிப்புகளை அனுமதிக்கவும்.', cancel: 'ரத்து', save: 'நினைவூட்டலை அமை' },
    ml: { title: 'ഓർമ്മപ്പെടുത്തൽ സജ്ജമാക്കുക', description: 'ഈ ആഴ്ചതോറുമുള്ള ഓർമ്മപ്പെടുത്തലിനായി ദിവസങ്ങളും പ്രാദേശിക സമയവും തിരഞ്ഞെടുക്കുക.', name: 'തലക്കെട്ട്', days: 'ഈ ദിവസങ്ങളിൽ ആവർത്തിക്കുക', time: 'ഓർമ്മപ്പെടുത്തൽ സമയം', sound: 'ശബ്ദം', multiple: 'ഈ ദുആ മറ്റൊരു സമയത്ത് ക്രമീകരിക്കാൻ മറ്റൊരു ഓർമ്മപ്പെടുത്തൽ സൃഷ്ടിക്കുക.', browser: 'ഓർമ്മപ്പെടുത്തലുകൾ പ്രവർത്തിക്കാൻ ആപ്പ് ബ്രൗസർ ടാബിൽ തുറന്നുവെക്കുക.', selectDay: 'കുറഞ്ഞത് ഒരു ദിവസമെങ്കിലും തിരഞ്ഞെടുക്കുക.', permission: 'ഓർമ്മപ്പെടുത്തൽ സംരക്ഷിക്കാൻ ബ്രൗസർ അറിയിപ്പുകൾ അനുവദിക്കുക.', cancel: 'റദ്ദാക്കുക', save: 'ഓർമ്മപ്പെടുത്തൽ സജ്ജമാക്കുക' },
  };
  const reminderText = reminderLabels[language] || reminderLabels.en;

  const toggleReminderDay = (day: ReminderDay) => {
    setReminderDays(current => current.includes(day)
      ? current.filter(selected => selected !== day)
      : [...current, day]);
  };

  const saveWeeklyReminder = async () => {
    if (reminderDays.length === 0) {
      setReminderError(reminderText.selectDay);
      return;
    }

    const saved = await addReminder({
      duaId: dua.id,
      duaTitle: dua.title[language] || dua.title.en,
      duaArabic: dua.arabic,
      times: dua.times,
      frequency: 'weekly',
      time: reminderTime,
      days: reminderDays,
      sound: reminderSound,
      enabled: true,
    });
    if (!saved) {
      setReminderError(reminderText.permission);
      return;
    }
    setReminderError('');
    setShowReminderModal(false);
  };

  const isCurrentlyBookmarked = isBookmarked(dua.id);

  const reciteLabel = language === 'en' ? 'Recite' :
    language === 'ar' ? 'اقرأ' :
    language === 'ur' ? 'پڑھیں' :
    language === 'fr' ? 'Réciter' :
    language === 'tr' ? 'Oku' :
    language === 'id' ? 'Baca' :
    language === 'bn' ? 'পড়ুন' :
    language === 'ms' ? 'Baca' :
    language === 'ta' ? 'படிக்கவும்' :
    'വായിക്കുക';

  const referenceLabel = language === 'en' ? 'Reference' :
    language === 'ar' ? 'المصدر' :
    language === 'ur' ? 'حوالہ' :
    language === 'fr' ? 'Référence' :
    language === 'tr' ? 'Kaynak' :
    language === 'id' ? 'Referensi' :
    language === 'bn' ? 'সূত্র' :
    language === 'ms' ? 'Rujukan' :
    language === 'ta' ? 'ஆதாரம்' :
    'അവലംബം';

  const timesLabel = language === 'en' ? 'times' :
    language === 'ar' ? 'مرات' :
    language === 'ur' ? 'بار' :
    language === 'fr' ? 'fois' :
    language === 'tr' ? 'kez' :
    language === 'id' ? 'kali' :
    language === 'bn' ? 'বার' :
    language === 'ms' ? 'kali' :
    language === 'ta' ? 'முறை' :
    'തവണ';

  return (
    <div className="max-w-3xl mx-auto">
      {/* Back Button */}
      <button
        onClick={onBack}
        className={`mb-6 flex items-center gap-2 transition-colors ${
          isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span>{language === 'en' ? 'Back' : language === 'ar' ? 'رجوع' : language === 'ur' ? 'واپس' : language === 'fr' ? 'Retour' : language === 'tr' ? 'Geri' : language === 'id' ? 'Kembali' : language === 'bn' ? 'পিছনে' : language === 'ms' ? 'Kembali' : language === 'ta' ? 'பின்' : 'തിരികെ'}</span>
      </button>

      {/* Dua Card */}
      <div className={`rounded-2xl shadow-xl border overflow-hidden ${
        isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'
      }`}>
        {/* Header */}
        <div className={`bg-gradient-to-r ${category.gradient} p-6 text-white`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{category.icon}</span>
              <span className="text-sm text-white/80">{category.name[language] || category.name.en}</span>
            </div>
            {/* Bookmark Button */}
            <button
              onClick={handleBookmark}
              className={`p-2 rounded-full transition-all ${
                isCurrentlyBookmarked 
                  ? 'bg-white/30 hover:bg-white/40' 
                  : 'bg-white/10 hover:bg-white/20'
              } ${bookmarkAnimating ? 'animate-heart' : ''}`}
              title={isCurrentlyBookmarked ? 'Remove bookmark' : 'Add bookmark'}
            >
              {isCurrentlyBookmarked ? (
                <svg className="w-6 h-6 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              )}
            </button>
          </div>
          <h2 className="text-xl font-bold">{dua.title[language] || dua.title.en}</h2>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">{referenceLabel}: {dua.reference}</span>
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">{reciteLabel}: {dua.times} {timesLabel}</span>
          </div>
        </div>

        {/* Arabic Text */}
        <div className={`p-6 border-b ${isDark ? 'border-slate-700' : 'border-gray-100'}`}>
          <div className="flex items-center justify-between mb-4">
            <span className={`text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-400'}`}>
              {language === 'en' ? 'Arabic Text' : language === 'ar' ? 'النص العربي' : language === 'ur' ? 'عربی متن' : language === 'fr' ? 'Texte Arabe' : language === 'tr' ? 'Arapça Metin' : language === 'id' ? 'Teks Arab' : language === 'bn' ? 'আরবি টেক্সট' : language === 'ms' ? 'Teks Arab' : language === 'ta' ? 'அரபி உரை' : 'അറബിക് പാഠം'}
            </span>
            {/* Font Size Controls */}
            <div className="flex items-center gap-1">
              {(['sm', 'md', 'lg', 'xl'] as const).map((size) => (
                <button
                  key={size}
                  onClick={() => setFontSize(size)}
                  className={`w-7 h-7 rounded-md text-xs font-bold transition-colors ${
                    fontSize === size
                      ? isDark ? 'bg-emerald-900 text-emerald-300' : 'bg-emerald-100 text-emerald-700'
                      : isDark ? 'text-gray-400 hover:text-gray-200 hover:bg-slate-700' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  A
                </button>
              ))}
            </div>
          </div>
          <p
            dir="rtl"
            className={`${arabicFontSize[fontSize]} leading-loose text-center font-arabic ${isDark ? 'text-gray-100' : 'text-gray-800'} py-4`}
            style={{ fontFamily: "'Amiri', 'Traditional Arabic', 'Noto Naskh Arabic', serif" }}
          >
            {dua.arabic}
          </p>
        </div>

        {/* Audio Player */}
        <div className={`p-4 border-b ${isDark ? 'border-slate-700' : 'border-gray-100'}`}>
          <AudioPlayer arabicText={dua.arabic} language={language} />
        </div>

        {/* Translation */}
        <div className={`p-6 border-b ${isDark ? 'border-slate-700 bg-slate-900/50' : 'border-gray-100 bg-gray-50/50'}`}>
          <span className={`text-xs font-medium uppercase tracking-wider mb-3 block ${isDark ? 'text-gray-400' : 'text-gray-400'}`}>
            {language === 'en' ? 'Translation' : language === 'ar' ? 'الترجمة' : language === 'ur' ? 'ترجمہ' : language === 'fr' ? 'Traduction' : language === 'tr' ? 'Çeviri' : language === 'id' ? 'Terjemahan' : language === 'bn' ? 'অনুবাদ' : language === 'ms' ? 'Terjemahan' : language === 'ta' ? 'மொழிபெயர்ப்பு' : 'വിവർത്തനം'}
          </span>
          <p className={`text-lg leading-relaxed ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
            {dua.translation[language] || dua.translation.en}
          </p>
        </div>

        {/* Actions */}
        <div className={`p-4 flex items-center justify-between ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
          <div className="flex items-center gap-2">
            <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-400'}`}>{dua.reference}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSetReminder}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isDark ? 'bg-blue-900 text-blue-300 hover:bg-blue-800' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {language === 'en' ? 'Set Reminder' : language === 'ar' ? 'تعيين تذكير' : language === 'ur' ? 'یاد دہانی سیٹ کریں' : language === 'fr' ? 'Définir un Rappel' : language === 'tr' ? 'Hatırlatıcı Ayarla' : language === 'id' ? 'Atur Pengingat' : language === 'bn' ? 'রিমাইন্ডার সেট করুন' : language === 'ms' ? 'Tetapkan Peringatan' : language === 'ta' ? 'நினைவூட்டல் அமை' : 'ഒരു ഓർമ്മപ്പെടുത്തൽ സജ്ജമാക്കുക'}
            </button>
            <button
              onClick={handleCopy}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                copied
                  ? isDark ? 'bg-emerald-900 text-emerald-300' : 'bg-emerald-100 text-emerald-700'
                  : isDark ? 'bg-slate-700 text-gray-200 hover:bg-slate-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {copied ? (
                <>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {language === 'en' ? 'Copied!' : language === 'ar' ? 'تم النسخ!' : language === 'ur' ? 'کاپی ہو گیا!' : language === 'fr' ? 'Copié!' : language === 'tr' ? 'Kopyalandı!' : language === 'id' ? 'Disalin!' : language === 'bn' ? 'কপি হয়েছে!' : language === 'ms' ? 'Disalin!' : language === 'ta' ? 'நகலெடுக்கப்பட்டது!' : 'പകർത്തി!'}
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  {language === 'en' ? 'Copy' : language === 'ar' ? 'نسخ' : language === 'ur' ? 'کاپی' : language === 'fr' ? 'Copier' : language === 'tr' ? 'Kopyala' : language === 'id' ? 'Salin' : language === 'bn' ? 'কপি' : language === 'ms' ? 'Salin' : language === 'ta' ? 'நகலெடு' : 'പകർത്തുക'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Counter */}
      <DuaCounter language={language} targetTimes={dua.times} />

      {/* Reminder Modal */}
      {showReminderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowReminderModal(false)}>
          <div 
            className={`w-full max-w-md rounded-2xl shadow-2xl overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-white'}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`p-6 border-b ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
              <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                ⏰ {reminderText.title}
              </h3>
              <p className={`text-sm mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {reminderText.description}
              </p>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {reminderText.name}
                </label>
                <input
                  type="text"
                  value={dua.title[language] || dua.title.en}
                  readOnly
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {reminderText.days}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {dayOptions.map(day => (
                    <button
                      key={day.value}
                      type="button"
                      aria-pressed={reminderDays.includes(day.value)}
                      onClick={() => toggleReminderDay(day.value)}
                      className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                        reminderDays.includes(day.value)
                          ? 'bg-emerald-600 text-white'
                          : isDark
                            ? 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {day.labels[language] || day.labels.en}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {reminderText.time}
                </label>
                <input
                  type="time"
                  value={reminderTime}
                  onChange={event => setReminderTime(event.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {reminderText.sound}
                </label>
                <select
                  value={reminderSound}
                  onChange={event => setReminderSound(event.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  {sounds.map(sound => (
                    <option key={sound.id} value={sound.id}>{sound.emoji} {sound.name}</option>
                  ))}
                </select>
              </div>
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {reminderText.multiple} {reminderText.browser}
              </p>
              {reminderError && <p role="alert" className="text-sm text-red-500">{reminderError}</p>}
            </div>

            <div className={`p-4 border-t ${isDark ? 'border-slate-700' : 'border-gray-200'} flex gap-2`}>
              <button
                onClick={() => setShowReminderModal(false)}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                  isDark ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                }`}
              >
                {reminderText.cancel}
              </button>
              <button
                onClick={() => void saveWeeklyReminder()}
                disabled={reminderDays.length === 0}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                  reminderDays.length === 0
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : isDark ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                }`}
              >
                {reminderText.save}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DuaCounter({ language, targetTimes }: { language: string; targetTimes: number }) {
  const [count, setCount] = useState(0);
  const { isDark } = useTheme();

  const label = language === 'en' ? 'Dua Counter' :
    language === 'ar' ? 'عداد الذكر' :
    language === 'ur' ? 'ذکر کاؤنٹر' :
    language === 'fr' ? 'Compteur de Dua' :
    language === 'tr' ? 'Dua Sayacı' :
    language === 'id' ? 'Penghitung Doa' :
    language === 'bn' ? 'দোয়া কাউন্টার' :
    language === 'ms' ? 'Penghitung Doa' :
    language === 'ta' ? 'துஆ எண்ணிக்கை' :
    'ദുആ എണ്ണി';

  return (
    <div className={`mt-6 rounded-2xl shadow-lg border p-6 text-center ${
      isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'
    }`}>
      <h3 className={`text-sm font-medium mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{label}</h3>
      <div className="flex items-center justify-center gap-6">
        <button
          onClick={() => setCount(Math.max(0, count - 1))}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
            isDark ? 'bg-slate-700 hover:bg-slate-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>
        
        <div className="text-center">
          <div className={`text-4xl font-bold ${count >= targetTimes ? 'text-emerald-500' : isDark ? 'text-white' : 'text-gray-800'}`}>
            {count}
          </div>
          <div className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>/ {targetTimes}</div>
        </div>

        <button
          onClick={() => setCount(count + 1)}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
            isDark ? 'bg-emerald-900 hover:bg-emerald-800 text-emerald-300' : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-600'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      <button
        onClick={() => setCount(0)}
        className={`mt-4 text-xs transition-colors ${isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
      >
        {language === 'en' ? 'Reset' : language === 'ar' ? 'إعادة' : language === 'ur' ? 'ری سیٹ' : language === 'fr' ? 'Réinitialiser' : language === 'tr' ? 'Sıfırla' : language === 'id' ? 'Reset' : language === 'bn' ? 'রিসেট' : language === 'ms' ? 'Reset' : language === 'ta' ? 'மீட்டமை' : 'പുനഃക്രമീകരിക്കുക'}
      </button>

      {count >= targetTimes && (
        <div className="mt-3 text-emerald-500 text-sm font-medium animate-pulse">
          ✓ {language === 'en' ? 'Completed!' : language === 'ar' ? 'تم!' : language === 'ur' ? 'مکمل!' : language === 'fr' ? 'Terminé!' : language === 'tr' ? 'Tamamlandı!' : language === 'id' ? 'Selesai!' : language === 'bn' ? 'সম্পন্ন!' : language === 'ms' ? 'Selesai!' : language === 'ta' ? 'முடிந்தது!' : 'പൂർത്തിയായി!'}
        </div>
      )}
    </div>
  );
}
