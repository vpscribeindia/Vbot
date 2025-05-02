const sequelize = require('./config/sequelize');
const File = require('./models/file');
const Transcript = require('./models/transcript');
const User = require('./models/user');
const Userinfo = require('./models/userInfo');
const Billing = require('./models/billing');
const Template = require('./models/template');
const EmailStatus = require('./models/emailstatus');

const { Op } = require('sequelize');

const db = { sequelize, Op, File, Transcript, User, Userinfo, Billing, Template, EmailStatus };

async function initializeDatabase() {
  try {
    User.hasMany(File, { foreignKey: 'user_id' });
    File.belongsTo(User, { foreignKey: 'user_id' });

    User.hasOne(Billing, { foreignKey: 'user_id' });
    Billing.belongsTo(User, { foreignKey: 'user_id' });

    File.hasOne(Transcript, { foreignKey: 'fileId' });
    Transcript.belongsTo(File, { foreignKey: 'fileId' });

    Template.hasMany(Transcript, { foreignKey: 'templateId' });
    Transcript.belongsTo(Template, { foreignKey: 'templateId' });

    User.hasOne(Userinfo, { foreignKey: 'user_id' });
    Userinfo.belongsTo(User, { foreignKey: 'user_id' });

    User.hasOne(EmailStatus, { foreignKey: 'user_id' });
    EmailStatus.belongsTo(User, { foreignKey: 'user_id' });
    User.hasOne(Userinfo, { foreignKey: 'user_id', as: 'profile' });

    //    await Template.create({
    //       templateName: 'SOAP General Notes',
    //       headings: `[Visit Summary]  
    // [Subjective]  
    // [Objective]  
    // [Assessment]  
    // [Plan]  
    // [Patient Instructions]  
    // [Transcript Summary]`,
    //     });
    //     await Template.create({
    //       templateName: 'EHR General Notes',
    //       headings: `[Patient Name]  
    // [Date of Service]  
    // [Provider]  
    // [Visit Type]  
    // [Subjective]  
    // [Objective]  
    // [Assessment]  
    // [Plan]  
    // [Medications]  
    // [Instructions Given]  
    // [Follow-Up]`,
    //     });
    //     await Template.create({
    //       templateName: 'Returning / Follow-Up Visit',
    //       headings: `[Chief Complaint]  
    // [Interval History]  
    // [Review of Systems (ROS)]  
    // [Physical Exam]  
    // [Assessment]  
    // [Plan]  
    // [Medications]  
    // [Follow-Up]`,
    //     });
    //     await Template.create({
    //       templateName: 'New Patient Visit',
    //       headings: `[Chief Complaint]  
    // [History of Present Illness (HPI)]  
    // [Past Medical History]  
    // [Medications]  
    // [Allergies]  
    // [Family History]  
    // [Social History]  
    // [Review of Systems (ROS)]  
    // [Physical Exam]  
    // [Assessment]  
    // [Plan]  
    // [Follow-Up]`,
    //     });
    //     await Template.create({
    //       templateName: 'Discharge Summary',
    //       headings: `[Admitting Diagnosis]  
    //     [Discharge Diagnosis]  
    //     [Hospital Course]  
    //     [Procedures Performed]  
    //     [Medications at Discharge]  
    //     [Follow-Up]  
    //     [Instructions to Patient]`,
    //     });
    //     await Template.create({
    //       templateName: 'Procedure Notes',
    //       headings: `[Procedure Performed]  
    //     [Indication]  
    //     [Consent]  
    //     [Technique]  
    //     [Findings]  
    //     [Complications]  
    //     [Disposition]`,
    //     });
    //     await Template.create({
    //       templateName: 'Psychiatry Notes',
    //       headings: `[Chief Complaint]  
    //     [History of Present Illness]  
    //     [Past Psychiatric History]  
    //     [Substance Use History]  
    //     [Mental Status Exam]  
    //     [Assessment]  
    //     [Plan]  
    //     [Risk Assessment]  
    //     [Follow-Up]`,
    //     });
    //     await Template.create({
    //       templateName: 'Pediatric Well-Child Visit',
    //       headings: `[Chief Complaint]  
    //     [History of Present Illness]  
    //     [Growth Parameters]  
    //     [Developmental History]  
    //     [Review of Systems]  
    //     [Physical Exam]  
    //     [Immunization Status]  
    //     [Assessment]  
    //     [Plan]  
    //     [Parental Guidance Given]  
    //     [Follow-Up]`,
    //     });
    //     await Template.create({
    //       templateName: 'Annual Wellness Visit',
    //       headings: `[Chief Complaint]  
    //     [Preventive Screenings Reviewed]  
    //     [Medical History Update]  
    //     [Social History Update]  
    //     [Review of Systems]  
    //     [Physical Exam]  
    //     [Assessment]  
    //     [Plan]  
    //     [Health Maintenance Counseling]  
    //     [Follow-Up]`,
    //     });
    //     await Template.create({
    //       templateName: 'Dental Visit',
    //       headings: `[Chief Complaint]  
    //     [History of Present Illness]  
    //     [Dental History]  
    //     [Oral Examination]  
    //     [X-ray/Imaging Findings]  
    //     [Assessment]  
    //     [Treatment Plan]  
    //     [Oral Hygiene Instructions]  
    //     [Follow-Up]`,
    //     });
    //     await Template.create({
    //       templateName: 'Post-Operative Notes',
    //       headings: `[Procedure Performed]  
    //     [Post-op Day #]  
    //     [Subjective Complaints]  
    //     [Objective Findings]  
    //     [Wound/Incision Status]  
    //     [Assessment]  
    //     [Plan]  
    //     [Pain Management]  
    //     [Follow-Up]`,
    //     });
    //     await Template.create({
    //       templateName: 'Inpatient Progress Notes',
    //       headings: `[Subjective]  
    //     [Objective]  
    //     [Assessment]  
    //     [Plan]  
    //     [Medications Updated]  
    //     [Lab/Imaging Updates]  
    //     [Disposition Plan]`,
    //     });
    //     await Template.create({
    //       templateName: 'Pre-Operative Evaluation',
    //       headings: `[Chief Complaint / Reason for Surgery]  
    //     [Medical History]  
    //     [Surgical History]  
    //     [Anesthesia Risk Assessment]  
    //     [Review of Systems]  
    //     [Physical Exam]  
    //     [Pre-op Lab Results]  
    //     [Assessment]  
    //     [Plan]  
    //     [Clearance Given]`,
    //     });
    //     await Template.create({
    //       templateName: 'Telehealth Visit',
    //       headings: `[Chief Complaint]  
    //     [History of Present Illness]  
    //     [Review of Systems]  
    //     [Vitals (Self-reported)]  
    //     [Visual Inspection Findings]  
    //     [Assessment]  
    //     [Plan]  
    //     [Patient Instructions]  
    //     [Technical Issues/Limitations]  
    //     [Follow-Up]`,
    //     });
    //     await Template.create({
    //       templateName: 'Oncology Follow-Up',
    //       headings: `[Chief Complaint]  
    //     [History of Present Illness]  
    //     [Review of Treatment Tolerance]  
    //     [Review of Systems]  
    //     [Physical Exam]  
    //     [Lab/Imaging Results]  
    //     [Assessment]  
    //     [Treatment Plan]  
    //     [Follow-Up]`,
    //     });
    //     await Template.create({
    //       templateName: 'OB/GYN Visit',
    //       headings: `[Chief Complaint]  
    //     [History of Present Illness]  
    //     [Gynecologic History]  
    //     [Obstetric History]  
    //     [Menstrual History]  
    //     [Review of Systems]  
    //     [Physical Exam]  
    //     [Pelvic Exam Findings]  
    //     [Assessment]  
    //     [Plan]  
    //     [Follow-Up]`,
    //     });
    //     await Template.create({
    //       templateName: 'Cardiology Visit',
    //       headings: `[Chief Complaint]  
    //     [History of Present Illness]  
    //     [Cardiac History]  
    //     [Review of Systems]  
    //     [Medications]  
    //     [Physical Exam]  
    //     [Diagnostic Studies Reviewed]  
    //     [Assessment]  
    //     [Plan]  
    //     [Follow-Up]`,
    //     });
    //     await Template.create({
    //       templateName: 'Orthopedic Visit',
    //       headings: `[Chief Complaint]  
    //     [History of Present Illness]  
    //     [Mechanism of Injury]  
    //     [Review of Systems]  
    //     [Physical Exam]  
    //     [Imaging Studies Reviewed]  
    //     [Assessment]  
    //     [Plan]  
    //     [Rehabilitation Instructions]  
    //     [Follow-Up]`,
    //     });


    await sequelize.authenticate();
    console.log("✅ Database connection established successfully!");
    await sequelize.sync({ alter: false });
    console.log("✅ Database & tables created!");

  } catch (err) {
    console.error("❌ Database connection failed:", err);
    process.exit(1);
  }
}

initializeDatabase();

module.exports = db;
