"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { setDocumentAttribute } from "@/lib/domAttrs";

export type Lang = "en" | "ta";

const translations = {
  en: {
    navDashboard: "Dashboard", navEvents: "Events", navMoi: "Moi", navGuests: "Guests", navLedger: "Ledger", navVendors: "Vendors", navSettings: "Settings",
    moiTitle: "Moi", createMoi: "Create Moi", createMoiModalTitle: "Create Moi", saveMoi: "Save Moi",
    moiTotalReceived: "Total Received", moiMoneyReceived: "Money Received", moiGiftValue: "Gift Value", moiTotalContributions: "Total Contributions",
    searchMoi: "Search guest or gift...", moiReceived: "Received", moiContributionType: "Contribution Type", moiTypeMoney: "Money", moiTypeGift: "Gift",
    secBasicInfo: "Basic Info", secSchedule: "Schedule & Guests", secVenueBudget: "Venue & Budget", secNotes: "Notes",
    livePreview: "Live Preview", secGuestDetails: "Guest Details", secContactInfo: "Contact Info", secEventAssign: "Event Assignment",
    secVendorDetails: "Vendor Details", secContactLocation: "Contact & Location", secContributionFrom: "Contribution From",
    secMoneyDetails: "Money Details", secGiftDetails: "Gift Details", secAdditionalInfo: "Additional Info",
    moiAmount: "Amount", moiPaymentMethod: "Payment Method", moiReference: "Reference Number",
    moiGiftCategory: "Gift Category", moiGiftName: "Gift Name", moiQuantity: "Quantity", moiUnit: "Unit", moiGiftValueField: "Value (optional)", moiNotes: "Notes",
    toastMoiSaved: "Moi contribution saved.",
    guestProfileTitle: "Guest Profile", backToGuests: "Back", editGuest: "Edit Guest",
    gpDetails: "Details", gpAddress: "Address", gpCity: "City / District", gpRelationLabel: "Relation",
    gpCategory: "Category", gpPeopleCount: "People attending", gpInviteStatus: "Invitation", gpNotes: "Notes",
    gpMoiGifts: "Moi & Gifts", gpViewHistory: "View History", gpContributionHistory: "Contribution History",
    gpEvents: "Events",
    themeLabel: "Light",
    appearanceField: "Appearance", appearanceLight: "Light", appearanceDark: "Dark", appearanceSystem: "System",
    accentThemeField: "Accent Theme",
    beautifulMoments: "Beautiful moments, thoughtfully kept.",
    welcomeBack: "Welcome back", goodEvening: "Good Evening, Arun", mayEvery: "May every celebration become a beautiful memory.",
    searchDash: "Search events, guests...", searchGuests: "Search guests...",
    notifications: "Notifications", rsvpPending: "12 Guest RSVPs pending", followUp: "Follow up with guests",
    paymentDueTomorrow: "Payment due tomorrow", forCatering: "₹35,000 for catering",
    vendorConfirmedHead: "Vendor confirmed", momentsStudioAccepted: "Moments Studio accepted",
    eventManager: "Event Manager", accountSettings: "Account Settings", signOut: "Sign Out", viewAllNotifications: "View All",
    heroTitle: "Your celebrations, beautifully organized.",
    heroSubtitle: "Bring together your events, guests, vendors and finances — all in one peaceful place.",
    createEvent: "Create Event", viewEvents: "View Events",
    upcomingEvents: "Upcoming Events", totalGuests: "Total Guests", pendingPayments: "Pending Payments", vendorsLabel: "Vendors", tasksToday: "Tasks Today",
    attendingLabel: "Attending", notAttendingLabel: "Not Attending", pendingLabel: "Pending",
    upcomingCelebrations: "Upcoming Celebrations", viewAll: "View All",
    needsAttention: "Needs Your Attention",
    paymentDue35: "₹35,000 payment due tomorrow", reviewLedger: "Review Ledger",
    photographyContract: "Photography contract awaiting confirmation", contactVendor: "Contact Vendor",
    seatingReview: "Seating arrangement needs review", openEvent: "Open Event",
    journey: "Journey", pctReady: "78% Ready",
    journeyGuests: "Guests", journeyVendors: "Vendors", journeyPayments: "Payments", journeyTasks: "Tasks", journeyCelebration: "Celebration",
    ledgerCardTitle: "Ledger", viewLedger: "View Ledger",
    paidLegend: "Paid", remainingLegend: "Remaining", budgetLegend: "Budget",
    recentMoments: "Recent Moments",
    momentJoined: "24 guests joined the celebration", minsAgo10: "10 mins ago",
    momentCatering: "Catering confirmed", hourAgo1: "1 hour ago",
    momentPayment: "₹45,000 payment recorded", hoursAgo3: "3 hours ago",
    momentVendor: "Photography vendor confirmed", hoursAgo5: "5 hours ago",
    momentAttending: "3 guests marked attending", yesterday: "Yesterday",
    weddingCelebration: "Wedding Celebration", birthdayCelebration: "Birthday Celebration",
    anniversaryCelebration: "Anniversary Celebration", corporateEvent: "Corporate Event", familyCelebration: "Family Celebration",
    journeyNote: "You're on the right path! Keep going, beautiful memories await.",
    statusConfirmed: "Confirmed", statusPlanning: "Planning", statusSaveDate: "Save the Date",
    allEvents: "All Events", calendarView: "Calendar View", listView: "List View",
    thEvent: "Event", thDate: "Date", thLocation: "Location", thGuests: "Guests", thStatus: "Status", thActions: "Actions",
    thGuest: "Guest", thContact: "Contact", thRsvp: "RSVP Status", thGroup: "Group",
    showing: "Showing", of: "of", eventsWord: "events", guestsWord: "guests", vendorsWord: "vendors",
    guestsTitle: "Guests", importGuests: "Import Guests", addGuest: "Add Guest",
    ledgerPageTitle: "Ledger", totalBudget: "Total Budget", totalPaid: "Total Paid", totalRemaining: "Total Remaining", paymentsLabel: "Payments",
    tabOverview: "Overview", tabAllTransactions: "All Transactions", tabIncome: "Income", tabExpenses: "Expenses", tabReports: "Reports",
    budgetOverview: "Budget Overview", categoryBreakdown: "Category Breakdown", recentTransactions: "Recent Transactions", viewAllTransactions: "View All Transactions",
    catVenue: "Venue", catCatering: "Catering", catDecoration: "Decoration", catPhotography: "Photography", catEntertainment: "Entertainment", catTransport: "Transport",
    catVenueChip: "Venue", catOthers: "Others",
    vendorsPageTitle: "Vendors", addVendor: "Add Vendor",
    statusBooked: "Booked", statusContacted: "Contacted", statusQuotation: "Quotation", statusShortlisted: "Shortlisted",
    settingsPageTitle: "Settings",
    tabProfile: "Profile", tabPreferences: "Preferences", tabNotifications: "Notifications", tabSecurity: "Security", tabEventPrefs: "Event Preferences", tabPaymentSettings: "Payment Settings",
    changePhoto: "Change Photo", fullName: "Full Name", emailField: "Email", phoneField: "Phone", roleField: "Role", saveChanges: "Save Changes",
    dateFormat: "Date Format", timeFormat: "Time Format", currencyField: "Currency", languageField: "Language", themeField: "Accent Theme", savePreferences: "Save Preferences",
    notifIntro: "Choose how DigiMoiBook keeps you informed.", emailNotif: "Email notifications", smsReminders: "SMS reminders",
    passwordField: "Password", twoFactor: "Two-factor authentication",
    defaultRsvp: "Default RSVP window", defaultGroup: "Default guest group",
    preferredPayment: "Preferred payment method", billingEmail: "Billing email",
    quickSettings: "Quick Settings",
    backupExport: "Backup & Export", exportYourData: "Export your data",
    templates: "Templates", manageTemplates: "Manage templates",
    inviteTeam: "Invite Team", addTeamMembers: "Add team members",
    privacy: "Privacy", managePrivacy: "Manage privacy",
    createEventModalTitle: "Create Event", addGuestModalTitle: "Add Guest", addVendorModalTitle: "Add Vendor",
    eventNameField: "Event Name", eventNamePh: "e.g. Ravi & Anu Wedding", eventTypeField: "Event Type",
    optWedding: "Wedding", optBirthday: "Birthday", optAnniversary: "Anniversary", optCorporate: "Corporate", optFamily: "Family", optOther: "Other",
    expectedGuests: "Expected Guests", dateField: "Date", timeField: "Time", locationField: "Location", budgetField: "Budget", descriptionField: "Description",
    cancel: "Cancel",
    guestNameField: "Guest Name", groupField: "Group", grpFamily: "Family", grpFriends: "Friends", grpColleagues: "Colleagues", grpRelatives: "Relatives",
    eventField: "Event",
    vendorNameField: "Vendor Name", categoryField: "Category",
    toastCalendar: "Calendar view is coming soon.", toastEventCreated: "Event created successfully.",
    toastGuestAdded: "Guest added successfully.", toastVendorAdded: "Vendor added successfully.",
    toastProfileSaved: "Profile changes saved.", toastPrefsSaved: "Preferences saved.",
    months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    weekdaysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  },
  ta: {
    navDashboard: "டாஷ்போர்டு", navEvents: "நிகழ்வுகள்", navMoi: "மொய்", navGuests: "விருந்தினர்கள்", navLedger: "கணக்கீடு", navVendors: "விற்பனையாளர்கள்", navSettings: "அமைப்புகள்",
    moiTitle: "மொய்", createMoi: "மொய் சேர்", createMoiModalTitle: "மொய் சேர்", saveMoi: "மொய் சேமி",
    moiTotalReceived: "மொத்தம் பெற்றது", moiMoneyReceived: "பணம் பெற்றது", moiGiftValue: "பரிசு மதிப்பு", moiTotalContributions: "மொத்த பங்களிப்புகள்",
    searchMoi: "விருந்தினர் அல்லது பரிசு தேடு...", moiReceived: "பெறப்பட்டது", moiContributionType: "பங்களிப்பு வகை", moiTypeMoney: "பணம்", moiTypeGift: "பரிசு",
    secBasicInfo: "அடிப்படை தகவல்", secSchedule: "நேரம் & விருந்தினர்கள்", secVenueBudget: "இடம் & பட்ஜெட்", secNotes: "குறிப்புகள்",
    livePreview: "நேரடி முன்னோட்டம்", secGuestDetails: "விருந்தினர் விவரங்கள்", secContactInfo: "தொடர்பு தகவல்", secEventAssign: "நிகழ்வு ஒதுக்கீடு",
    secVendorDetails: "விற்பனையாளர் விவரங்கள்", secContactLocation: "தொடர்பு & இடம்", secContributionFrom: "பங்களிப்பு அளித்தவர்",
    secMoneyDetails: "பண விவரங்கள்", secGiftDetails: "பரிசு விவரங்கள்", secAdditionalInfo: "கூடுதல் தகவல்",
    moiAmount: "தொகை", moiPaymentMethod: "கட்டண முறை", moiReference: "குறிப்பு எண்",
    moiGiftCategory: "பரிசு வகை", moiGiftName: "பரிசு பெயர்", moiQuantity: "அளவு", moiUnit: "அலகு", moiGiftValueField: "மதிப்பு (விரும்பினால்)", moiNotes: "குறிப்புகள்",
    toastMoiSaved: "மொய் பங்களிப்பு சேமிக்கப்பட்டது.",
    guestProfileTitle: "விருந்தினர் சுயவிவரம்", backToGuests: "பின்", editGuest: "திருத்து",
    gpDetails: "விவரங்கள்", gpAddress: "முகவரி", gpCity: "நகரம் / மாவட்டம்", gpRelationLabel: "உறவு",
    gpCategory: "வகை", gpPeopleCount: "வரும் நபர்கள்", gpInviteStatus: "அழைப்பு", gpNotes: "குறிப்புகள்",
    gpMoiGifts: "மொய் & பரிசுகள்", gpViewHistory: "வரலாறு", gpContributionHistory: "பங்களிப்பு வரலாறு",
    gpEvents: "நிகழ்வுகள்",
    themeLabel: "வெளிச்சம்",
    appearanceField: "தோற்றம்", appearanceLight: "வெளிச்சம்", appearanceDark: "இருள்", appearanceSystem: "கணினி",
    accentThemeField: "அழகுசார் தீம்",
    beautifulMoments: "அழகான தருணங்கள், அன்புடன் பாதுகாக்கப்படுவை.",
    welcomeBack: "மீண்டும் வரவு", goodEvening: "மாலை வணக்கம், அருண்", mayEvery: "ஒவ்வொரு கொண்டாட்டமும் அழகான நினைவாக மாறட்டும்.",
    searchDash: "நிகழ்வுகள், விருந்தினர்களைத் தேடுங்கள்...", searchGuests: "விருந்தினர்களைத் தேடுங்கள்...",
    notifications: "அறிவிப்புகள்", rsvpPending: "12 விருந்தினர் பதில் நிலுவையில்", followUp: "விருந்தினர்களை தொடர்பு கொள்ளவும்",
    paymentDueTomorrow: "நாளை கட்டணம் செலுத்த வேண்டும்", forCatering: "₹35,000 உணவு சேவைக்கு",
    vendorConfirmedHead: "விற்பனையாளர் உறுதி செய்யப்பட்டது", momentsStudioAccepted: "Moments Studio ஏற்றுக்கொண்டது",
    eventManager: "நிகழ்வு மேலாளர்", accountSettings: "கணக்கு அமைப்புகள்", signOut: "வெளியேறு", viewAllNotifications: "அனைத்தையும் காண்க",
    heroTitle: "உங்கள் கொண்டாட்டங்கள், அழகாக ஒழுங்கமைக்கப்பட்டவை.",
    heroSubtitle: "உங்கள் நிகழ்வுகள், விருந்தினர்கள், விற்பனையாளர்கள் மற்றும் நிதி — அனைத்தையும் ஒரே அமைதியான இடத்தில் சேர்க்கவும்.",
    createEvent: "நிகழ்வு உருவாக்கு", viewEvents: "நிகழ்வுகளைக் காண்க",
    upcomingEvents: "வரவிருக்கும் நிகழ்வுகள்", totalGuests: "மொத்த விருந்தினர்கள்", pendingPayments: "நிலுவைத் தொகை", vendorsLabel: "விற்பனையாளர்கள்", tasksToday: "இன்றைய பணிகள்",
    attendingLabel: "கலந்துகொள்கிறார்", notAttendingLabel: "கலந்துகொள்ளவில்லை", pendingLabel: "நிலுவையில்",
    upcomingCelebrations: "வரவிருக்கும் கொண்டாட்டங்கள்", viewAll: "அனைத்தையும் காண்க",
    needsAttention: "கவனம் தேவை",
    paymentDue35: "₹35,000 நாளை கட்டண வேண்டும்", reviewLedger: "கணக்கீட்டை பார்வையிடவும்",
    photographyContract: "புகைப்படக் ஒப்பந்தம் உறுதிக்காக காத்திருக்கிறது", contactVendor: "விற்பனையாளரை தொடர்பு கொள்ளவும்",
    seatingReview: "இருக்கை ஏற்பாடு மறுபரிசீலனை தேவை", openEvent: "நிகழ்வைத் திற",
    journey: "பயணம்", pctReady: "78% தயார்",
    journeyGuests: "விருந்தினர்கள்", journeyVendors: "விற்பனையாளர்கள்", journeyPayments: "கட்டணங்கள்", journeyTasks: "பணிகள்", journeyCelebration: "கொண்டாட்டம்",
    ledgerCardTitle: "கணக்கீடு", viewLedger: "கணக்கீட்டைக் காண்க",
    paidLegend: "செலுத்தியது", remainingLegend: "மீதம்", budgetLegend: "பட்ஜெட்",
    recentMoments: "சமீபத்திய தருணங்கள்",
    momentJoined: "24 விருந்தினர்கள் கொண்டாட்டத்தில் சேர்ந்தனர்", minsAgo10: "10 நிமிடங்களுக்கு முன்",
    momentCatering: "உணவு சேவை உறுதி செய்யப்பட்டது", hourAgo1: "1 மணி நேரத்திற்கு முன்",
    momentPayment: "₹45,000 கட்டணம் பதிவு செய்யப்பட்டது", hoursAgo3: "3 மணி நேரத்திற்கு முன்",
    momentVendor: "புகைப்படக் கலைஞர் உறுதி செய்யப்பட்டார்", hoursAgo5: "5 மணி நேரத்திற்கு முன்",
    momentAttending: "3 விருந்தினர்கள் கலந்துகொள்வதாக குறிக்கப்பட்டனர்", yesterday: "நேற்று",
    weddingCelebration: "திருமண கொண்டாட்டம்", birthdayCelebration: "பிறந்தநாள் கொண்டாட்டம்",
    anniversaryCelebration: "ஆண்டுவிழா கொண்டாட்டம்", corporateEvent: "நிறுவன நிகழ்வு", familyCelebration: "குடும்ப கொண்டாட்டம்",
    journeyNote: "நீங்கள் சரியான பாதையில் உள்ளீர்கள்! தொடருங்கள், அழகான நினைவுகள் காத்திருக்கின்றன.",
    statusConfirmed: "உறுதி செய்யப்பட்டது", statusPlanning: "திட்டமிடல்", statusSaveDate: "தேதியை சேமிக்கவும்",
    allEvents: "அனைத்து நிகழ்வுகள்", calendarView: "நாட்காட்டி காட்சி", listView: "பட்டியல் காட்சி",
    thEvent: "நிகழ்வு", thDate: "தேதி", thLocation: "இடம்", thGuests: "விருந்தினர்கள்", thStatus: "நிலை", thActions: "செயல்கள்",
    thGuest: "விருந்தினர்", thContact: "தொடர்பு", thRsvp: "RSVP நிலை", thGroup: "குழு",
    showing: "காண்பிக்கிறது", of: "இல்", eventsWord: "நிகழ்வுகள்", guestsWord: "விருந்தினர்கள்", vendorsWord: "விற்பனையாளர்கள்",
    guestsTitle: "விருந்தினர்கள்", importGuests: "விருந்தினர்களை இறக்குமதி செய்", addGuest: "விருந்தினரைச் சேர்",
    ledgerPageTitle: "கணக்கீடு", totalBudget: "மொத்த பட்ஜெட்", totalPaid: "மொத்தம் செலுத்தியது", totalRemaining: "மொத்த மீதம்", paymentsLabel: "கட்டணங்கள்",
    tabOverview: "கண்ணோட்டம்", tabAllTransactions: "அனைத்து பரிவர்த்தனைகள்", tabIncome: "வருமானம்", tabExpenses: "செலவுகள்", tabReports: "அறிக்கைகள்",
    budgetOverview: "பட்ஜெட் கண்ணோட்டம்", categoryBreakdown: "வகைப்பாடு", recentTransactions: "சமீபத்திய பரிவர்த்தனைகள்", viewAllTransactions: "அனைத்து பரிவர்த்தனைகளையும் காண்க",
    catVenue: "இடம்", catCatering: "உணவு சேவை", catDecoration: "அலங்காரம்", catPhotography: "புகைப்படம்", catEntertainment: "பொழுதுபோக்கு", catTransport: "போக்குவரத்து",
    catVenueChip: "இடம்", catOthers: "மற்றவை",
    vendorsPageTitle: "விற்பனையாளர்கள்", addVendor: "விற்பனையாளரைச் சேர்",
    statusBooked: "முன்பதிவு செய்யப்பட்டது", statusContacted: "தொடர்பு கொள்ளப்பட்டது", statusQuotation: "மேற்கோள்", statusShortlisted: "தேர்ந்தெடுக்கப்பட்டது",
    settingsPageTitle: "அமைப்புகள்",
    tabProfile: "சுயவிவரம்", tabPreferences: "விருப்பங்கள்", tabNotifications: "அறிவிப்புகள்", tabSecurity: "பாதுகாப்பு", tabEventPrefs: "நிகழ்வு விருப்பங்கள்", tabPaymentSettings: "கட்டண அமைப்புகள்",
    changePhoto: "புகைப்படத்தை மாற்று", fullName: "முழு பெயர்", emailField: "மின்னஞ்சல்", phoneField: "தொலைபேசி", roleField: "பணி", saveChanges: "மாற்றங்களை சேமி",
    dateFormat: "தேதி வடிவம்", timeFormat: "நேர வடிவம்", currencyField: "நாணயம்", languageField: "மொழி", themeField: "அழகுசார் தீம்", savePreferences: "விருப்பங்களை சேமி",
    notifIntro: "DigiMoiBook உங்களை எவ்வாறு தெரிவிக்க வேண்டும் என்பதைத் தேர்வு செய்யவும்.", emailNotif: "மின்னஞ்சல் அறிவிப்புகள்", smsReminders: "SMS நினைவூட்டல்கள்",
    passwordField: "கடவுச்சொல்", twoFactor: "இரு-படி சரிபார்ப்பு",
    defaultRsvp: "இயல்பான RSVP காலம்", defaultGroup: "இயல்பான விருந்தினர் குழு",
    preferredPayment: "விரும்பப்படும் கட்டண முறை", billingEmail: "பில்லிங் மின்னஞ்சல்",
    quickSettings: "விரைவு அமைப்புகள்",
    backupExport: "காப்பு & ஏற்றுமதி", exportYourData: "உங்கள் தரவை ஏற்றுமதி செய்யவும்",
    templates: "வார்ப்புருக்கள்", manageTemplates: "வார்ப்புருக்கள் நிர்வகி",
    inviteTeam: "குழுவை அழை", addTeamMembers: "குழு உறுப்பினர்களைச் சேர்",
    privacy: "தனியுரிமை", managePrivacy: "தனியுரிமையை நிர்வகி",
    createEventModalTitle: "நிகழ்வு உருவாக்கு", addGuestModalTitle: "விருந்தினரைச் சேர்", addVendorModalTitle: "விற்பனையாளரைச் சேர்",
    eventNameField: "நிகழ்வின் பெயர்", eventNamePh: "எ.கா. ரவி & அன் திருமணம்", eventTypeField: "நிகழ்வு வகை",
    optWedding: "திருமணம்", optBirthday: "பிறந்தநாள்", optAnniversary: "ஆண்டுவிழா", optCorporate: "நிறுவனம்", optFamily: "குடும்பம்", optOther: "மற்றவை",
    expectedGuests: "எதிர்பார்க்கப்படும் விருந்தினர்கள்", dateField: "தேதி", timeField: "நேரம்", locationField: "இடம்", budgetField: "பட்ஜெட்", descriptionField: "விளக்கம்",
    cancel: "ரத்து செய்",
    guestNameField: "விருந்தினர் பெயர்", groupField: "குழு", grpFamily: "குடும்பம்", grpFriends: "நண்பர்கள்", grpColleagues: "சக ஊழியர்கள்", grpRelatives: "உறவினர்கள்",
    eventField: "நிகழ்வு",
    vendorNameField: "விற்பனையாளர் பெயர்", categoryField: "வகை",
    toastCalendar: "நாட்காட்டி காட்சி விரைவில் வரும்.", toastEventCreated: "நிகழ்வு வெற்றிகரமாக உருவாக்கப்பட்டது.",
    toastGuestAdded: "விருந்தினர் வெற்றிகரமாக சேர்க்கப்பட்டார்.", toastVendorAdded: "விற்பனையாளர் வெற்றிகரமாக சேர்க்கப்பட்டார்.",
    toastProfileSaved: "சுயவிவர மாற்றங்கள் சேமிக்கப்பட்டன.", toastPrefsSaved: "விருப்பங்கள் சேமிக்கப்பட்டன.",
    months: ["ஜனவரி", "பிப்ரவரி", "மார்ச்", "ஏப்ரல்", "மே", "ஜூன்", "ஜூலை", "ஆகஸ்ட்", "செப்டம்பர்", "அக்டோபர்", "நவம்பர்", "டிசம்பர்"],
    weekdaysShort: ["ஞா", "தி", "செ", "பு", "வி", "வெ", "ச"],
  },
} as const;

export type TranslationKey = keyof typeof translations.en;

interface I18nContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: TranslationKey) => string;
  months: readonly string[];
  weekdaysShort: readonly string[];
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    // Reading localStorage must happen post-mount (SSR has no storage); this
    // one-time sync from a browser API is the standard exception to the rule.
    try {
      const saved = localStorage.getItem("imoibook-lang");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (saved === "en" || saved === "ta") setLangState(saved);
    } catch {}
  }, []);

  useEffect(() => {
    setDocumentAttribute("lang", lang);
    setDocumentAttribute("data-lang", lang);
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      localStorage.setItem("imoibook-lang", next);
    } catch {}
  }, []);

  const t = useCallback(
    (key: TranslationKey) => translations[lang][key] ?? translations.en[key] ?? key,
    [lang]
  ) as (key: TranslationKey) => string;

  const value = useMemo(
    () => ({ lang, setLang, t, months: translations[lang].months, weekdaysShort: translations[lang].weekdaysShort }),
    [lang, setLang, t]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
