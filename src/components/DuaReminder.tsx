import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { CustomReminder, ReminderDay, useNotifications } from '../contexts/NotificationsContext';

interface DuaReminderProps {
  language: string;
}

export default function DuaReminder({ language }: DuaReminderProps) {
  const { isDark } = useTheme();
  const { customReminders, addReminder, removeReminder, toggleReminder, sounds, playSound } = useNotifications();
  const [showForm, setShowForm] = useState(false);
  const [permissionError, setPermissionError] = useState(false);
  const today = (['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as ReminderDay[])[new Date().getDay()];
  const [newReminder, setNewReminder] = useState({
    duaTitle: '',
    duaArabic: '',
    time: '08:00',
    frequency: 'weekly' as CustomReminder['frequency'],
    days: [today] as ReminderDay[],
    sound: 'adhan',
    enabled: true,
  });

  const dayOptions: { value: ReminderDay; label: Record<string, string> }[] = [
    { value: 'mon', label: { en: 'Mon', ar: 'اثنين', ur: 'پیر', fr: 'Lun', tr: 'Pzt', id: 'Sen', bn: 'সোম', ms: 'Isn', ta: 'திங்', ml: 'തിങ്ക' } },
    { value: 'tue', label: { en: 'Tue', ar: 'ثلاثاء', ur: 'منگل', fr: 'Mar', tr: 'Sal', id: 'Sel', bn: 'মঙ্গল', ms: 'Sel', ta: 'செவ்', ml: 'ചൊവ്വ' } },
    { value: 'wed', label: { en: 'Wed', ar: 'أربعاء', ur: 'بدھ', fr: 'Mer', tr: 'Çar', id: 'Rab', bn: 'বুধ', ms: 'Rab', ta: 'புத', ml: 'ബുധ' } },
    { value: 'thu', label: { en: 'Thu', ar: 'خميس', ur: 'جمعرات', fr: 'Jeu', tr: 'Per', id: 'Kam', bn: 'বৃহ', ms: 'Kha', ta: 'வியா', ml: 'വ്യാഴ' } },
    { value: 'fri', label: { en: 'Fri', ar: 'جمعة', ur: 'جمعہ', fr: 'Ven', tr: 'Cum', id: 'Jum', bn: 'শুক্র', ms: 'Jum', ta: 'வெள்', ml: 'വെള്ള' } },
    { value: 'sat', label: { en: 'Sat', ar: 'سبت', ur: 'ہفتہ', fr: 'Sam', tr: 'Cmt', id: 'Sab', bn: 'শনি', ms: 'Sab', ta: 'சனி', ml: 'ശനി' } },
    { value: 'sun', label: { en: 'Sun', ar: 'أحد', ur: 'اتوار', fr: 'Dim', tr: 'Paz', id: 'Min', bn: 'রবি', ms: 'Ahd', ta: 'ஞாயி', ml: 'ഞായ' } },
  ];

  const labels: Record<string, Record<string, string>> = {
    en: { title: 'Custom Reminders', add: 'Add Reminder', noReminders: 'No reminders yet', delete: 'Delete', test: 'Test Sound', title2: 'Title', arabic: 'Arabic Text', time: 'Time', frequency: 'Frequency', daily: 'Daily', weekly: 'Weekly', days: 'Repeat on', sound: 'Notification Sound', save: 'Save', cancel: 'Cancel', permissionError: 'Allow browser notifications to save a reminder.', multiple: 'Add another reminder to schedule more than one time on a day.' },
    ar: { title: 'تذكيرات مخصصة', add: 'إضافة تذكير', noReminders: 'لا توجد تذكيرات بعد', delete: 'حذف', test: 'اختبار الصوت', title2: 'العنوان', arabic: 'النص العربي', time: 'الوقت', frequency: 'التكرار', daily: 'يومي', weekly: 'أسبوعي', days: 'اختر الأيام', sound: 'صوت الإشعار', save: 'حفظ', cancel: 'إلغاء', permissionError: 'اسمح بإشعارات المتصفح لحفظ التذكير.', multiple: 'أضف تذكيراً آخر لجدولة أكثر من وقت في اليوم.' },
    ur: { title: 'اپنی یاد دہانیاں', add: 'یاد دہانی شامل کریں', noReminders: 'ابھی تک کوئی یاد دہانی نہیں', delete: 'حذف کریں', test: 'آواز آزمائیں', title2: 'عنوان', arabic: 'عربی متن', time: 'وقت', frequency: 'تکرار', daily: 'روزانہ', weekly: 'ہفتہ وار', days: 'دن منتخب کریں', sound: 'اطلاع کی آواز', save: 'محفوظ کریں', cancel: 'منسوخ کریں', permissionError: 'یاد دہانی محفوظ کرنے کے لیے براؤزر کی اطلاعات کی اجازت دیں۔', multiple: 'ایک دن میں کئی اوقات کے لیے ایک اور یاد دہانی شامل کریں۔' },
    fr: { title: 'Rappels Personnalisés', add: 'Ajouter un Rappel', noReminders: 'Aucun rappel pour le moment', delete: 'Supprimer', test: 'Tester le Son', title2: 'Titre', arabic: 'Texte Arabe', time: 'Heure', frequency: 'Fréquence', daily: 'Quotidien', weekly: 'Hebdomadaire', days: 'Sélectionner les jours', sound: 'Son de Notification', save: 'Enregistrer', cancel: 'Annuler', permissionError: 'Autorisez les notifications du navigateur pour enregistrer un rappel.', multiple: 'Ajoutez un autre rappel pour programmer plusieurs heures dans une journée.' },
    tr: { title: 'Özel Hatırlatıcılar', add: 'Hatırlatıcı Ekle', noReminders: 'Henüz hatırlatıcı yok', delete: 'Sil', test: 'Sesi Test Et', title2: 'Başlık', arabic: 'Arapça Metin', time: 'Zaman', frequency: 'Sıklık', daily: 'Günlük', weekly: 'Haftalık', days: 'Günleri seçin', sound: 'Bildirim Sesi', save: 'Kaydet', cancel: 'İptal', permissionError: 'Hatırlatıcıyı kaydetmek için tarayıcı bildirimlerine izin verin.', multiple: 'Bir günde birden fazla saat için başka bir hatırlatıcı ekleyin.' },
    id: { title: 'Pengingat Kustom', add: 'Tambah Pengingat', noReminders: 'Belum ada pengingat', delete: 'Hapus', test: 'Uji Suara', title2: 'Judul', arabic: 'Teks Arab', time: 'Waktu', frequency: 'Frekuensi', daily: 'Harian', weekly: 'Mingguan', days: 'Pilih hari', sound: 'Suara Notifikasi', save: 'Simpan', cancel: 'Batal', permissionError: 'Izinkan notifikasi browser untuk menyimpan pengingat.', multiple: 'Tambahkan pengingat lain untuk menjadwalkan beberapa waktu dalam sehari.' },
    bn: { title: 'কাস্টম রিমাইন্ডার', add: 'রিমাইন্ডার যোগ করুন', noReminders: 'কোনো রিমাইন্ডার নেই', delete: 'মুছুন', test: 'শব্দ পরীক্ষা', title2: 'শিরোনাম', arabic: 'আরবি টেক্সট', time: 'সময়', frequency: 'ফ্রিকোয়েন্সি', daily: 'দৈনিক', weekly: 'সাপ্তাহিক', days: 'দিন নির্বাচন করুন', sound: 'বিজ্ঞপ্তি শব্দ', save: 'সংরক্ষণ', cancel: 'বাতিল', permissionError: 'রিমাইন্ডার সংরক্ষণ করতে ব্রাউজার বিজ্ঞপ্তির অনুমতি দিন।', multiple: 'এক দিনে একাধিক সময় নির্ধারণ করতে আরেকটি রিমাইন্ডার যোগ করুন।' },
    ms: { title: 'Peringatan Tersuai', add: 'Tambah Peringatan', noReminders: 'Tiada peringatan lagi', delete: 'Padam', test: 'Uji Bunyi', title2: 'Tajuk', arabic: 'Teks Arab', time: 'Masa', frequency: 'Kekerapan', daily: 'Harian', weekly: 'Mingguan', days: 'Pilih hari', sound: 'Bunyi Pemberitahuan', save: 'Simpan', cancel: 'Batal', permissionError: 'Benarkan pemberitahuan pelayar untuk menyimpan peringatan.', multiple: 'Tambah peringatan lain untuk menjadualkan beberapa waktu dalam sehari.' },
    ta: { title: 'தனிப்பயன் நினைவூட்டல்கள்', add: 'நினைவூட்டலைச் சேர்', noReminders: 'நினைவூட்டல்கள் இல்லை', delete: 'நீக்கு', test: 'ஒலி சோதனை', title2: 'தலைப்பு', arabic: 'அரபி உரை', time: 'நேரம்', frequency: 'அலைவரிசை', daily: 'தினசரி', weekly: 'வாராந்திர', days: 'நாட்களைத் தேர்ந்தெடு', sound: 'அறிவிப்பு ஒலி', save: 'சேமி', cancel: 'ரத்து', permissionError: 'நினைவூட்டலைச் சேமிக்க உலாவி அறிவிப்புகளை அனுமதிக்கவும்.', multiple: 'ஒரு நாளில் பல நேரங்களை அமைக்க மற்றொரு நினைவூட்டலைச் சேர்க்கவும்.' },
    ml: { title: 'ഇഷ്ടാനുസൃത ഓർമ്മപ്പെടുത്തലുകൾ', add: 'ഓർമ്മപ്പെടുത്തൽ ചേർക്കുക', noReminders: 'ഓർമ്മപ്പെടുത്തലുകൾ ഇല്ല', delete: 'ഇല്ലാതാക്കുക', test: 'ശബ്ദം പരീക്ഷിക്കുക', title2: 'തലക്കെട്ട്', arabic: 'അറബിക് പാഠം', time: 'സമയം', frequency: 'ആവൃത്തി', daily: 'ദൈനംദിനം', weekly: 'ആഴ്ചതോറും', days: 'ദിവസങ്ങൾ തിരഞ്ഞെടുക്കുക', sound: 'അറിയിപ്പ് ശബ്ദം', save: 'സംരക്ഷിക്കുക', cancel: 'റദ്ദാക്കുക', permissionError: 'ഓർമ്മപ്പെടുത്തൽ സംരക്ഷിക്കാൻ ബ്രൗസർ അറിയിപ്പുകൾ അനുവദിക്കുക.', multiple: 'ഒരു ദിവസത്തിൽ ഒന്നിലധികം സമയങ്ങൾക്കായി മറ്റൊരു ഓർമ്മപ്പെടുത്തൽ ചേർക്കുക.' },
  };

  const label = labels[language as keyof typeof labels] || labels.en;
  const getDayLabel = (day: ReminderDay) => {
    const option = dayOptions.find(item => item.value === day);
    return option?.label[language as keyof typeof option.label] || day;
  };

  const handleSubmit = () => {
    if (!newReminder.duaTitle.trim() || !newReminder.duaArabic.trim() || (newReminder.frequency === 'weekly' && newReminder.days.length === 0)) return;
    void addReminder({ ...newReminder, duaId: `custom-${Date.now()}`, times: 1 }).then(added => {
      if (!added) {
        setPermissionError(true);
        return;
      }
      setNewReminder({
      duaTitle: '',
      duaArabic: '',
      time: '08:00',
      frequency: 'weekly',
      days: [today],
      sound: 'adhan',
      enabled: true,
      });
      setPermissionError(false);
      setShowForm(false);
    });
  };

  const toggleDay = (day: ReminderDay) => {
    setNewReminder(prev => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day]
    }));
  };

  return (
    <div className={`rounded-2xl p-6 border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} shadow-lg`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          ⏰ {label.title}
        </h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            isDark
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
              : 'bg-emerald-500 hover:bg-emerald-600 text-white'
          }`}
        >
          {showForm ? label.cancel : label.add}
        </button>
      </div>

      {/* Add Reminder Form */}
      {showForm && (
        <div className={`mb-6 p-4 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-gray-50 border-gray-200'}`}>
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                {label.title2}
              </label>
              <input
                type="text"
                value={newReminder.duaTitle}
                onChange={(e) => setNewReminder({ ...newReminder, duaTitle: e.target.value })}
                placeholder="e.g., Morning Adhkar"
                className={`w-full px-3 py-2 rounded-lg border ${
                  isDark
                    ? 'bg-slate-800 border-slate-600 text-white placeholder-gray-500'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                }`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                {label.arabic}
              </label>
              <textarea
                value={newReminder.duaArabic}
                onChange={(e) => setNewReminder({ ...newReminder, duaArabic: e.target.value })}
                placeholder="أدخل النص العربي"
                dir="rtl"
                rows={3}
                className={`w-full px-3 py-2 rounded-lg border ${
                  isDark
                    ? 'bg-slate-800 border-slate-600 text-white placeholder-gray-500'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                }`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                {label.time}
              </label>
              <input
                type="time"
                value={newReminder.time}
                onChange={(e) => setNewReminder({ ...newReminder, time: e.target.value })}
                className={`w-full px-3 py-2 rounded-lg border ${
                  isDark
                    ? 'bg-slate-800 border-slate-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                {label.frequency}
              </label>
              <select
                value={newReminder.frequency}
                onChange={(e) => setNewReminder({ ...newReminder, frequency: e.target.value as CustomReminder['frequency'] })}
                className={`w-full px-3 py-2 rounded-lg border ${
                  isDark
                    ? 'bg-slate-800 border-slate-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="daily">{label.daily}</option>
                <option value="weekly">{label.weekly}</option>
              </select>
            </div>

            {newReminder.frequency === 'weekly' && (
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {label.days}
                </label>
                <div className="flex flex-wrap gap-2">
                  {dayOptions.map((day) => (
                    <button
                      key={day.value}
                      onClick={() => toggleDay(day.value)}
                      className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                        newReminder.days.includes(day.value)
                          ? isDark
                            ? 'bg-emerald-600 text-white'
                            : 'bg-emerald-500 text-white'
                          : isDark
                          ? 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {day.label[language as keyof typeof day.label] || day.label.en}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                {label.sound}
              </label>
              <div className="flex flex-wrap gap-2">
                {sounds.map((sound) => (
                  <button
                    key={sound.id}
                    onClick={() => setNewReminder({ ...newReminder, sound: sound.id })}
                    className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                      newReminder.sound === sound.id
                        ? isDark
                          ? 'bg-emerald-600 text-white'
                          : 'bg-emerald-500 text-white'
                        : isDark
                        ? 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {sound.emoji} {sound.name}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={!newReminder.duaTitle.trim() || !newReminder.duaArabic.trim() || (newReminder.frequency === 'weekly' && newReminder.days.length === 0)}
              className={`w-full py-2 rounded-lg font-medium transition-colors ${
                !newReminder.duaTitle || !newReminder.duaArabic
                  ? isDark
                    ? 'bg-slate-700 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : isDark
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-emerald-500 hover:bg-emerald-600 text-white'
              }`}
            >
              {label.save}
            </button>
            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {label.multiple}
            </p>
            {permissionError && (
              <p role="alert" className="text-sm text-red-500">{label.permissionError}</p>
            )}
          </div>
        </div>
      )}

      {/* Reminders List */}
      {customReminders.length === 0 ? (
        <p className={`text-center py-8 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
          {label.noReminders}
        </p>
      ) : (
        <div className="space-y-3">
          {customReminders.map((reminder) => (
            <div
              key={reminder.id}
              className={`p-4 rounded-xl border transition-all ${
                reminder.enabled
                  ? isDark
                    ? 'bg-slate-900 border-slate-700'
                    : 'bg-gray-50 border-gray-200'
                  : isDark
                  ? 'bg-slate-900/50 border-slate-800 opacity-50'
                  : 'bg-gray-50/50 border-gray-100 opacity-50'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">⏰</span>
                    <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {reminder.duaTitle}
                    </h4>
                  </div>
                  <p dir="rtl" className={`text-sm mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} style={{ fontFamily: "'Amiri', serif" }}>
                    {reminder.duaArabic.substring(0, 60)}...
                  </p>
                  <div className="flex items-center gap-3 text-xs">
                    <span className={isDark ? 'text-gray-500' : 'text-gray-500'}>
                      🕐 {reminder.time}
                    </span>
                    <span className={isDark ? 'text-gray-500' : 'text-gray-500'}>
                      {reminder.frequency === 'daily'
                        ? label.daily
                        : `${label.weekly}: ${reminder.days.map(getDayLabel).join(', ')}`}
                    </span>
                    <span className={isDark ? 'text-gray-500' : 'text-gray-500'}>
                      {sounds.find(s => s.id === reminder.sound)?.emoji} {sounds.find(s => s.id === reminder.sound)?.name}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => playSound(reminder.sound)}
                    className={`p-2 rounded-lg transition-colors ${
                      isDark
                        ? 'bg-slate-700 hover:bg-slate-600 text-gray-300'
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                    }`}
                    title={label.test}
                  >
                    🔊
                  </button>
                  <button
                    onClick={() => toggleReminder(reminder.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      reminder.enabled
                        ? isDark
                          ? 'bg-emerald-900/50 text-emerald-400 hover:bg-emerald-900'
                          : 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200'
                        : isDark
                        ? 'bg-slate-700 text-gray-400 hover:bg-slate-600'
                        : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
                    }`}
                  >
                    {reminder.enabled ? '✓' : '○'}
                  </button>
                  <button
                    onClick={() => removeReminder(reminder.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      isDark
                        ? 'bg-red-900/50 text-red-400 hover:bg-red-900'
                        : 'bg-red-100 text-red-600 hover:bg-red-200'
                    }`}
                    title={label.delete}
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
