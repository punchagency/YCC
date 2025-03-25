import React, { createContext, useContext, useState, useEffect } from "react";

// Create language context
export const LanguageContext = createContext();

// Available languages
export const languages = [
  { name: "English", code: "en" },
  { name: "Spanish", code: "es" },
  { name: "French", code: "fr" },
  { name: "German", code: "de" },
  { name: "Italian", code: "it" },
  { name: "Portuguese", code: "pt" },
  { name: "Russian", code: "ru" },
  { name: "Chinese", code: "zh" },
  { name: "Japanese", code: "ja" },
  { name: "Arabic", code: "ar" },
];

// Translations for different languages - expanded to include more UI elements
const translations = {
  en: {
    // Common UI elements
    dashboard: "Dashboard",
    inventory: "Inventory",
    orders: "Orders",
    reports: "Reports",
    calendar: "Calendar",
    settings: "Settings",
    logout: "Logout",
    search: "Search",
    notifications: "Notifications",
    profile: "Profile",

    // Settings page
    manageSettings: "Manage Settings",
    name: "Name",
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm Password",
    phoneNumber: "Phone Number",
    twoFactorAuthentication: "Two-Factor Authentication",
    enableTwoFactorAuth: "Enable Two-Factor Authentication",
    language: "Language",
    timezone: "Timezone",
    saveChanges: "Save Changes",
    selectLanguage: "Select Language",
    selectTimezone: "Select Timezone",

    // Navigation
    crewManagement: "Crew Management",
    headOfDepartment: "Head of Department",
    crew: "Crew",
    vesselManagement: "Vessel Management",
    vessel: "Vessel",
    scheduleCalendar: "Schedule Calendar",
    maintenance: "Maintenance",
    createTask: "Create Task",
    equipmentParts: "Equipment & Parts",
    financialManagement: "Financial Management",
    expense: "Expense",
    invoice: "Invoice",
    complianceTracking: "Compliance Tracking",
    compliance: "Compliance",
    documentManagement: "Document Management",
    bookings: "Bookings",
    helpCentre: "Help Centre",
    contactUs: "Contact Us",
    logOut: "Log Out",
  },

  es: {
    // Common UI elements
    dashboard: "Tablero",
    inventory: "Inventario",
    orders: "Pedidos",
    reports: "Informes",
    calendar: "Calendario",
    settings: "Configuración",
    logout: "Cerrar sesión",
    search: "Buscar",
    notifications: "Notificaciones",
    profile: "Perfil",

    // Settings page
    manageSettings: "Administrar Configuración",
    name: "Nombre",
    email: "Correo electrónico",
    password: "Contraseña",
    confirmPassword: "Confirmar Contraseña",
    phoneNumber: "Número de Teléfono",
    twoFactorAuthentication: "Autenticación de Dos Factores",
    enableTwoFactorAuth: "Habilitar Autenticación de Dos Factores",
    language: "Idioma",
    timezone: "Zona Horaria",
    saveChanges: "Guardar Cambios",
    selectLanguage: "Seleccionar Idioma",
    selectTimezone: "Seleccionar Zona Horaria",

    // Navigation
    crewManagement: "Gestión de Tripulación",
    headOfDepartment: "Jefe de Departamento",
    crew: "Tripulación",
    vesselManagement: "Gestión de Embarcaciones",
    vessel: "Embarcación",
    scheduleCalendar: "Calendario de Programación",
    maintenance: "Mantenimiento",
    createTask: "Crear Tarea",
    equipmentParts: "Equipos y Piezas",
    financialManagement: "Gestión Financiera",
    expense: "Gastos",
    invoice: "Factura",
    complianceTracking: "Seguimiento de Cumplimiento",
    compliance: "Cumplimiento",
    documentManagement: "Gestión de Documentos",
    bookings: "Reservas",
    helpCentre: "Centro de Ayuda",
    contactUs: "Contáctenos",
    logOut: "Cerrar Sesión",
  },

  fr: {
    // Common UI elements
    dashboard: "Tableau de Bord",
    inventory: "Inventaire",
    orders: "Commandes",
    reports: "Rapports",
    calendar: "Calendrier",
    settings: "Paramètres",
    logout: "Déconnexion",
    search: "Rechercher",
    notifications: "Notifications",
    profile: "Profil",

    // Settings page
    manageSettings: "Gérer les Paramètres",
    name: "Nom",
    email: "E-mail",
    password: "Mot de passe",
    confirmPassword: "Confirmer le Mot de passe",
    phoneNumber: "Numéro de Téléphone",
    twoFactorAuthentication: "Authentification à Deux Facteurs",
    enableTwoFactorAuth: "Activer l'Authentification à Deux Facteurs",
    language: "Langue",
    timezone: "Fuseau Horaire",
    saveChanges: "Enregistrer les Modifications",
    selectLanguage: "Sélectionner la Langue",
    selectTimezone: "Sélectionner le Fuseau Horaire",

    // Navigation
    crewManagement: "Gestion de l'Équipage",
    headOfDepartment: "Chef de Département",
    crew: "Équipage",
    vesselManagement: "Gestion des Navires",
    vessel: "Navire",
    scheduleCalendar: "Calendrier de Planification",
    maintenance: "Maintenance",
    createTask: "Créer une Tâche",
    equipmentParts: "Équipements et Pièces",
    financialManagement: "Gestion Financière",
    expense: "Dépense",
    invoice: "Facture",
    complianceTracking: "Suivi de Conformité",
    compliance: "Conformité",
    documentManagement: "Gestion Documentaire",
    bookings: "Réservations",
    helpCentre: "Centre d'Aide",
    contactUs: "Contactez-nous",
    logOut: "Déconnexion",
  },

  de: {
    // Common UI elements
    dashboard: "Dashboard",
    inventory: "Inventar",
    orders: "Bestellungen",
    reports: "Berichte",
    calendar: "Kalender",
    settings: "Einstellungen",
    logout: "Abmelden",
    search: "Suchen",
    notifications: "Benachrichtigungen",
    profile: "Profil",

    // Settings page
    manageSettings: "Einstellungen verwalten",
    name: "Name",
    email: "E-Mail",
    password: "Passwort",
    confirmPassword: "Passwort bestätigen",
    phoneNumber: "Telefonnummer",
    twoFactorAuthentication: "Zwei-Faktor-Authentifizierung",
    enableTwoFactorAuth: "Zwei-Faktor-Authentifizierung aktivieren",
    language: "Sprache",
    timezone: "Zeitzone",
    saveChanges: "Änderungen speichern",
    selectLanguage: "Sprache auswählen",
    selectTimezone: "Zeitzone auswählen",

    // Navigation
    crewManagement: "Crew-Management",
    headOfDepartment: "Abteilungsleiter",
    crew: "Besatzung",
    vesselManagement: "Schiffsverwaltung",
    vessel: "Schiff",
    scheduleCalendar: "Terminkalender",
    maintenance: "Wartung",
    createTask: "Aufgabe erstellen",
    equipmentParts: "Ausrüstung & Teile",
    financialManagement: "Finanzverwaltung",
    expense: "Ausgaben",
    invoice: "Rechnung",
    complianceTracking: "Compliance-Tracking",
    compliance: "Compliance",
    documentManagement: "Dokumentenverwaltung",
    bookings: "Buchungen",
    helpCentre: "Hilfezentrum",
    contactUs: "Kontakt",
    logOut: "Abmelden",
  },

  it: {
    // Common UI elements
    dashboard: "Dashboard",
    inventory: "Inventario",
    orders: "Ordini",
    reports: "Rapporti",
    calendar: "Calendario",
    settings: "Impostazioni",
    logout: "Disconnetti",
    search: "Cerca",
    notifications: "Notifiche",
    profile: "Profilo",

    // Settings page
    manageSettings: "Gestisci Impostazioni",
    name: "Nome",
    email: "Email",
    password: "Password",
    confirmPassword: "Conferma Password",
    phoneNumber: "Numero di Telefono",
    twoFactorAuthentication: "Autenticazione a Due Fattori",
    enableTwoFactorAuth: "Abilita Autenticazione a Due Fattori",
    language: "Lingua",
    timezone: "Fuso Orario",
    saveChanges: "Salva Modifiche",
    selectLanguage: "Seleziona Lingua",
    selectTimezone: "Seleziona Fuso Orario",

    // Navigation
    crewManagement: "Gestione Equipaggio",
    headOfDepartment: "Capo Dipartimento",
    crew: "Equipaggio",
    vesselManagement: "Gestione Imbarcazioni",
    vessel: "Imbarcazione",
    scheduleCalendar: "Calendario Programmazione",
    maintenance: "Manutenzione",
    createTask: "Crea Attività",
    equipmentParts: "Attrezzature e Parti",
    financialManagement: "Gestione Finanziaria",
    expense: "Spese",
    invoice: "Fattura",
    complianceTracking: "Monitoraggio Conformità",
    compliance: "Conformità",
    documentManagement: "Gestione Documenti",
    bookings: "Prenotazioni",
    helpCentre: "Centro Assistenza",
    contactUs: "Contattaci",
    logOut: "Disconnetti",
  },

  pt: {
    // Common UI elements
    dashboard: "Painel",
    inventory: "Inventário",
    orders: "Pedidos",
    reports: "Relatórios",
    calendar: "Calendário",
    settings: "Configurações",
    logout: "Sair",
    search: "Pesquisar",
    notifications: "Notificações",
    profile: "Perfil",

    // Settings page
    manageSettings: "Gerenciar Configurações",
    name: "Nome",
    email: "Email",
    password: "Senha",
    confirmPassword: "Confirmar Senha",
    phoneNumber: "Número de Telefone",
    twoFactorAuthentication: "Autenticação de Dois Fatores",
    enableTwoFactorAuth: "Ativar Autenticação de Dois Fatores",
    language: "Idioma",
    timezone: "Fuso Horário",
    saveChanges: "Salvar Alterações",
    selectLanguage: "Selecionar Idioma",
    selectTimezone: "Selecionar Fuso Horário",

    // Navigation
    crewManagement: "Gestão de Tripulação",
    headOfDepartment: "Chefe de Departamento",
    crew: "Tripulação",
    vesselManagement: "Gestão de Embarcações",
    vessel: "Embarcação",
    scheduleCalendar: "Calendário de Programação",
    maintenance: "Manutenção",
    createTask: "Criar Tarefa",
    equipmentParts: "Equipamentos e Peças",
    financialManagement: "Gestão Financeira",
    expense: "Despesa",
    invoice: "Fatura",
    complianceTracking: "Acompanhamento de Conformidade",
    compliance: "Conformidade",
    documentManagement: "Gestão de Documentos",
    bookings: "Reservas",
    helpCentre: "Centro de Ajuda",
    contactUs: "Contate-nos",
    logOut: "Sair",
  },

  ru: {
    // Common UI elements
    dashboard: "Панель управления",
    inventory: "Инвентарь",
    orders: "Заказы",
    reports: "Отчеты",
    calendar: "Календарь",
    settings: "Настройки",
    logout: "Выйти",
    search: "Поиск",
    notifications: "Уведомления",
    profile: "Профиль",

    // Settings page
    manageSettings: "Управление настройками",
    name: "Имя",
    email: "Электронная почта",
    password: "Пароль",
    confirmPassword: "Подтвердите пароль",
    phoneNumber: "Номер телефона",
    twoFactorAuthentication: "Двухфакторная аутентификация",
    enableTwoFactorAuth: "Включить двухфакторную аутентификацию",
    language: "Язык",
    timezone: "Часовой пояс",
    saveChanges: "Сохранить изменения",
    selectLanguage: "Выбрать язык",
    selectTimezone: "Выбрать часовой пояс",

    // Navigation
    crewManagement: "Управление экипажем",
    headOfDepartment: "Руководитель отдела",
    crew: "Экипаж",
    vesselManagement: "Управление судном",
    vessel: "Судно",
    scheduleCalendar: "Календарь расписания",
    maintenance: "Техническое обслуживание",
    createTask: "Создать задачу",
    equipmentParts: "Оборудование и запчасти",
    financialManagement: "Финансовое управление",
    expense: "Расходы",
    invoice: "Счет",
    complianceTracking: "Отслеживание соответствия",
    compliance: "Соответствие",
    documentManagement: "Управление документами",
    bookings: "Бронирования",
    helpCentre: "Центр помощи",
    contactUs: "Связаться с нами",
    logOut: "Выйти",
  },

  zh: {
    // Common UI elements
    dashboard: "仪表板",
    inventory: "库存",
    orders: "订单",
    reports: "报告",
    calendar: "日历",
    settings: "设置",
    logout: "登出",
    search: "搜索",
    notifications: "通知",
    profile: "个人资料",

    // Settings page
    manageSettings: "管理设置",
    name: "姓名",
    email: "电子邮件",
    password: "密码",
    confirmPassword: "确认密码",
    phoneNumber: "电话号码",
    twoFactorAuthentication: "双因素认证",
    enableTwoFactorAuth: "启用双因素认证",
    language: "语言",
    timezone: "时区",
    saveChanges: "保存更改",
    selectLanguage: "选择语言",
    selectTimezone: "选择时区",

    // Navigation
    crewManagement: "船员管理",
    headOfDepartment: "部门主管",
    crew: "船员",
    vesselManagement: "船舶管理",
    vessel: "船舶",
    scheduleCalendar: "日程日历",
    maintenance: "维护",
    createTask: "创建任务",
    equipmentParts: "设备和零件",
    financialManagement: "财务管理",
    expense: "支出",
    invoice: "发票",
    complianceTracking: "合规跟踪",
    compliance: "合规",
    documentManagement: "文档管理",
    bookings: "预订",
    helpCentre: "帮助中心",
    contactUs: "联系我们",
    logOut: "登出",
  },

  ja: {
    // Common UI elements
    dashboard: "ダッシュボード",
    inventory: "在庫",
    orders: "注文",
    reports: "レポート",
    calendar: "カレンダー",
    settings: "設定",
    logout: "ログアウト",
    search: "検索",
    notifications: "通知",
    profile: "プロフィール",

    // Settings page
    manageSettings: "設定管理",
    name: "名前",
    email: "メール",
    password: "パスワード",
    confirmPassword: "パスワードの確認",
    phoneNumber: "電話番号",
    twoFactorAuthentication: "二要素認証",
    enableTwoFactorAuth: "二要素認証を有効にする",
    language: "言語",
    timezone: "タイムゾーン",
    saveChanges: "変更を保存",
    selectLanguage: "言語を選択",
    selectTimezone: "タイムゾーンを選択",

    // Navigation
    crewManagement: "クルー管理",
    headOfDepartment: "部門長",
    crew: "クルー",
    vesselManagement: "船舶管理",
    vessel: "船舶",
    scheduleCalendar: "スケジュールカレンダー",
    maintenance: "メンテナンス",
    createTask: "タスク作成",
    equipmentParts: "機器と部品",
    financialManagement: "財務管理",
    expense: "経費",
    invoice: "請求書",
    complianceTracking: "コンプライアンス追跡",
    compliance: "コンプライアンス",
    documentManagement: "文書管理",
    bookings: "予約",
    helpCentre: "ヘルプセンター",
    contactUs: "お問い合わせ",
    logOut: "ログアウト",
  },

  ar: {
    // Common UI elements
    dashboard: "لوحة التحكم",
    inventory: "المخزون",
    orders: "الطلبات",
    reports: "التقارير",
    calendar: "التقويم",
    settings: "الإعدادات",
    logout: "تسجيل الخروج",
    search: "بحث",
    notifications: "الإشعارات",
    profile: "الملف الشخصي",

    // Settings page
    manageSettings: "إدارة الإعدادات",
    name: "الاسم",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    confirmPassword: "تأكيد كلمة المرور",
    phoneNumber: "رقم الهاتف",
    twoFactorAuthentication: "المصادقة الثنائية",
    enableTwoFactorAuth: "تمكين المصادقة الثنائية",
    language: "اللغة",
    timezone: "المنطقة الزمنية",
    saveChanges: "حفظ التغييرات",
    selectLanguage: "اختر اللغة",
    selectTimezone: "اختر المنطقة الزمنية",

    // Navigation
    crewManagement: "إدارة الطاقم",
    headOfDepartment: "رئيس القسم",
    crew: "الطاقم",
    vesselManagement: "إدارة السفن",
    vessel: "السفينة",
    scheduleCalendar: "تقويم الجدول",
    maintenance: "الصيانة",
    createTask: "إنشاء مهمة",
    equipmentParts: "المعدات والقطع",
    financialManagement: "الإدارة المالية",
    expense: "المصروفات",
    invoice: "الفاتورة",
    complianceTracking: "تتبع الامتثال",
    compliance: "الامتثال",
    documentManagement: "إدارة المستندات",
    bookings: "الحجوزات",
    helpCentre: "مركز المساعدة",
    contactUs: "اتصل بنا",
    logOut: "تسجيل الخروج",
  },
};

// Custom hook to use the language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

// Provider component
export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    // Initialize from localStorage or default to English
    const savedLanguage = localStorage.getItem("appLanguage");
    return savedLanguage || "en";
  });

  // Update localStorage when language changes
  useEffect(() => {
    localStorage.setItem("appLanguage", currentLanguage);
    document.documentElement.lang = currentLanguage;

    // Set text direction for RTL languages (Arabic)
    if (currentLanguage === "ar") {
      document.documentElement.dir = "rtl";
    } else {
      document.documentElement.dir = "ltr";
    }

    // You could also update the user's profile on the server here
  }, [currentLanguage]);

  // Get translations for the current language
  const getTranslation = (key) => {
    return translations[currentLanguage]?.[key] || translations.en[key] || key;
  };

  // Change the language
  const changeLanguage = (languageCode) => {
    if (translations[languageCode]) {
      setCurrentLanguage(languageCode);
    }
  };

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        changeLanguage,
        getTranslation,
        translations,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};
