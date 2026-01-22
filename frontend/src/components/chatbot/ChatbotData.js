export const chatbotData = [

/* ================= BASIC ================= */
{
  keywords: ["hello", "hi", "hey"],
  response: "Hello 👋 Welcome to CRIMSAFE. How can I assist you today?"
},
{
  keywords: ["who are you", "about you"],
  response: "I am CRIMSAFE AI Assistant 🤖, here to help you with crime reporting, safety guidance, and legal information."
},
{
  keywords: ["help", "support"],
  response: "I can help you with complaint registration, status tracking, IPC sections, safety tips, and emergency support."
},

/* ================= EMERGENCY ================= */
{
  keywords: ["emergency", "urgent", "help me"],
  response: "🚨 If this is an emergency, please call our 24×7 helpline immediately: 📞 9024383761"
},
{
  keywords: ["police number", "call police"],
  response: "📞 For immediate police assistance, call CRIMSAFE helpline: 9024383761 (24×7 available)."
},
{
  keywords: ["women emergency", "girl safety"],
  response: "🚨 Women safety helpline is available 24×7 at 📞 9024383761. Your safety matters."
},

/* ================= COMPLAINT ================= */
{
  keywords: ["register complaint", "file complaint"],
  response: "To register a complaint:\n1️⃣ Login\n2️⃣ Open Dashboard\n3️⃣ Fill complaint form\n4️⃣ Submit\n\nYour complaint will be tracked online."
},
{
  keywords: ["complaint status", "check status"],
  response: "You can check complaint status by logging in and opening 'View Complaints'."
},
{
  keywords: ["edit complaint"],
  response: "Once submitted, complaints cannot be edited by public users. Police/Admin handle updates."
},
{
  keywords: ["delete complaint"],
  response: "Complaints cannot be deleted once registered for legal safety."
},

/* ================= STATUS ================= */
{
  keywords: ["pending"],
  response: "🟡 Pending means the complaint is registered but not yet reviewed by police."
},
{
  keywords: ["under investigation"],
  response: "🔵 Under Investigation means police are actively working on the complaint."
},
{
  keywords: ["solved"],
  response: "🟢 Solved means action has been completed and the case is closed."
},
{
  keywords: ["invalid"],
  response: "🔴 Invalid means the complaint was found incorrect or insufficient."
},

/* ================= IPC ================= */
{
  keywords: ["ipc", "ipc section"],
  response: "IPC (Indian Penal Code) sections are automatically assigned based on crime type."
},
{
  keywords: ["theft ipc"],
  response: "Theft cases usually fall under IPC Section 379."
},
{
  keywords: ["cyber crime ipc"],
  response: "Cyber crimes are covered under IPC 420 and IT Act Section 66."
},
{
  keywords: ["domestic violence ipc"],
  response: "Domestic violence comes under IPC 498A and Domestic Violence Act."
},

/* ================= CYBER ================= */
{
  keywords: ["online scam", "fraud"],
  response: "Online scams fall under IPC 420 and IT Act 66D. Please register a complaint immediately."
},
{
  keywords: ["hacking", "account hacked"],
  response: "For hacking incidents, register a cyber complaint through Dashboard."
},
{
  keywords: ["fake job"],
  response: "Fake job scams are punishable under IPC 420."
},

/* ================= WOMEN & CHILD ================= */
{
  keywords: ["sexual harassment"],
  response: "Sexual harassment is punishable under IPC Section 354A."
},
{
  keywords: ["child abuse"],
  response: "Child abuse is handled under POCSO Act. Please report immediately."
},
{
  keywords: ["dowry"],
  response: "Dowry harassment is punishable under IPC Section 498A."
},

/* ================= POLICE ================= */
{
  keywords: ["police registration"],
  response: "Police users must register and wait for Admin approval."
},
{
  keywords: ["police approval"],
  response: "Admin verifies police identity before approval."
},
{
  keywords: ["police dashboard"],
  response: "Approved police users can view and update complaints."
},

/* ================= ADMIN ================= */
{
  keywords: ["admin role"],
  response: "Admin manages users, police approval, departments, and system monitoring."
},
{
  keywords: ["delete user"],
  response: "Admin can delete public or police users except other admins."
},
{
  keywords: ["department"],
  response: "Departments help categorize complaints for faster handling."
},

/* ================= MAP ================= */
{
  keywords: ["map", "location"],
  response: "Google Maps integration helps mark exact crime location during complaint registration."
},
{
  keywords: ["wrong location"],
  response: "Ensure correct location is selected while filing a complaint."
},

/* ================= PROFILE ================= */
{
  keywords: ["profile"],
  response: "You can view and update your profile information after login."
},
{
  keywords: ["change password"],
  response: "Password change feature will be added in future updates."
},

/* ================= GENERAL ================= */
{
  keywords: ["working hours"],
  response: "CRIMSAFE services are available 24×7."
},
{
  keywords: ["is this free"],
  response: "Yes ✅ CRIMSAFE is completely free for citizens."
},
{
  keywords: ["data safety"],
  response: "Your data is securely stored and accessible only to authorized users."
},

/* ================= END ================= */
{
  keywords: ["thank you", "thanks"],
  response: "You’re welcome 😊 Stay safe with CRIMSAFE."
}

];