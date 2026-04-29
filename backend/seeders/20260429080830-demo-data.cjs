'use strict';

// Demo bcrypt hash representing "password123" (12 rounds)
const DEMO_HASH = '$2b$12$Demo.Hash.ForSeeding.OnlyXXXXXXXXXXXXXXXXXXXXXXXXXXXX';

const USERS = [
  {
    id: '00000000-0000-0000-0000-000000000002',
    username: 'officer_michael',
    name: 'Michael Tan',
    email: 'michael.tan@msf.gov.sg',
    hash_password: DEMO_HASH,
    role: 'officer',
  },
  {
    id: '00000000-0000-0000-0000-000000000003',
    username: 'operator_alice',
    name: 'Alice Lim',
    email: 'alice.lim@brightfutures.org.sg',
    hash_password: DEMO_HASH,
    role: 'operator',
  },
  {
    id: '00000000-0000-0000-0000-000000000004',
    username: 'operator_bob',
    name: 'Bob Wong',
    email: 'bob.wong@sunrisecares.sg',
    hash_password: DEMO_HASH,
    role: 'operator',
  },
];

// Alice Lim's applications
const APP_ALICE_1 = 'aaaaaaaa-0001-0001-0001-aaaaaaaaaaaa';
const APP_ALICE_2 = 'aaaaaaaa-0002-0002-0002-aaaaaaaaaaaa';
const APP_ALICE_3 = 'aaaaaaaa-0003-0003-0003-aaaaaaaaaaaa';

// Bob Wong's applications
const APP_BOB_1 = 'bbbbbbbb-0001-0001-0001-bbbbbbbbbbbb';
const APP_BOB_2 = 'bbbbbbbb-0002-0002-0002-bbbbbbbbbbbb';
const APP_BOB_3 = 'bbbbbbbb-0003-0003-0003-bbbbbbbbbbbb';

const now = new Date();
const daysAgo = (n) => new Date(now - n * 86400000);

const APPLICATIONS = [
  // --- Alice Lim ---
  {
    id: APP_ALICE_1,
    full_name: 'Alice Lim Mei Ling',
    nric_or_passport: 'S8812345A',
    date_of_birth: '1988-03-15',
    gender: 'Female',
    nationality: 'Singaporean',
    contact_number: '+65 9111 2233',
    email: 'alice.lim@brightfutures.org.sg',
    home_address: '12 Clementi Ave 3, #08-22, Singapore 120012',
    business_name: 'Little Stars Child Care Centre',
    business_address: '15 Clementi Ave 3, #01-05, Singapore 120015',
    years_in_operation: 3,
    licence_type: 'Child Care Centre Licence',
    declaration_accuracy: true,
    declaration_consent: true,
    status: 'submitted',
    created_at: daysAgo(14),
    updated_at: daysAgo(14),
  },
  {
    id: APP_ALICE_2,
    full_name: 'Alice Lim Mei Ling',
    nric_or_passport: 'S8812345A',
    date_of_birth: '1988-03-15',
    gender: 'Female',
    nationality: 'Singaporean',
    contact_number: '+65 9111 2233',
    email: 'alice.lim@brightfutures.org.sg',
    home_address: '12 Clementi Ave 3, #08-22, Singapore 120012',
    business_name: 'Bright Futures Social Service Agency',
    business_address: '30 Buona Vista Drive, #04-10, Singapore 138672',
    years_in_operation: 7,
    licence_type: 'Social Service Agency Licence',
    declaration_accuracy: true,
    declaration_consent: true,
    status: 'under_review',
    created_at: daysAgo(30),
    updated_at: daysAgo(5),
  },
  {
    id: APP_ALICE_3,
    full_name: 'Alice Lim Mei Ling',
    nric_or_passport: 'S8812345A',
    date_of_birth: '1988-03-15',
    gender: 'Female',
    nationality: 'Singaporean',
    contact_number: '+65 9111 2233',
    email: 'alice.lim@brightfutures.org.sg',
    home_address: '12 Clementi Ave 3, #08-22, Singapore 120012',
    business_name: 'Safe Haven Foster Services',
    business_address: '5 Jalan Bahar, Singapore 649942',
    years_in_operation: 2,
    licence_type: 'Foster Care Service Licence',
    declaration_accuracy: true,
    declaration_consent: true,
    status: 'pending_pre_site_resubmission',
    created_at: daysAgo(45),
    updated_at: daysAgo(3),
  },
  // --- Bob Wong ---
  {
    id: APP_BOB_1,
    full_name: 'Bob Wong Kah Wai',
    nric_or_passport: 'S7934567B',
    date_of_birth: '1979-11-22',
    gender: 'Male',
    nationality: 'Singaporean',
    contact_number: '+65 9887 6655',
    email: 'bob.wong@sunrisecares.sg',
    home_address: '88 Jurong West St 42, #12-101, Singapore 640088',
    business_name: 'After School Care @ Jurong West',
    business_address: '20 Jurong West St 42, #01-01, Singapore 640020',
    years_in_operation: 10,
    licence_type: 'Centre-Based Student Care Licence',
    declaration_accuracy: true,
    declaration_consent: true,
    status: 'approved',
    created_at: daysAgo(90),
    updated_at: daysAgo(7),
  },
  {
    id: APP_BOB_2,
    full_name: 'Bob Wong Kah Wai',
    nric_or_passport: 'S7934567B',
    date_of_birth: '1979-11-22',
    gender: 'Male',
    nationality: 'Singaporean',
    contact_number: '+65 9887 6655',
    email: 'bob.wong@sunrisecares.sg',
    home_address: '88 Jurong West St 42, #12-101, Singapore 640088',
    business_name: 'Sunrise Residential Home',
    business_address: '3 Woodlands Ave 5, Singapore 738093',
    years_in_operation: 1,
    licence_type: 'Residential Child Care Service Licence',
    declaration_accuracy: true,
    declaration_consent: true,
    status: 'rejected',
    created_at: daysAgo(60),
    updated_at: daysAgo(15),
  },
  {
    id: APP_BOB_3,
    full_name: 'Bob Wong Kah Wai',
    nric_or_passport: 'S7934567B',
    date_of_birth: '1979-11-22',
    gender: 'Male',
    nationality: 'Singaporean',
    contact_number: '+65 9887 6655',
    email: 'bob.wong@sunrisecares.sg',
    home_address: '88 Jurong West St 42, #12-101, Singapore 640088',
    business_name: 'Warmth Family Group Home',
    business_address: '17 Sengkang East Way, Singapore 548593',
    years_in_operation: 4,
    licence_type: 'Family Group Home Licence',
    declaration_accuracy: true,
    declaration_consent: true,
    status: 'pre_site_resubmitted',
    created_at: daysAgo(50),
    updated_at: daysAgo(2),
  },
];

// Jane Doe = 00000000-0000-0000-0000-000000000001 (seeded via migration)
// Michael Tan = 00000000-0000-0000-0000-000000000002
const JANE = '00000000-0000-0000-0000-000000000001';
const MICHAEL = '00000000-0000-0000-0000-000000000002';

const COMMENTS = [
  // APP_ALICE_1 — submitted (2 comments)
  {
    id: 'cc000001-0000-0000-0000-000000000001',
    officer_id: JANE,
    application_id: APP_ALICE_1,
    comment: 'Application received and logged. Initial document check pending — please ensure ACRA registration certificate is included in your document package.',
    created_at: daysAgo(13),
    updated_at: daysAgo(13),
  },
  {
    id: 'cc000001-0000-0000-0000-000000000002',
    officer_id: MICHAEL,
    application_id: APP_ALICE_1,
    comment: 'Assigned to review queue. Contact number format noted — please confirm if this is a Singapore-registered mobile number.',
    created_at: daysAgo(12),
    updated_at: daysAgo(12),
  },

  // APP_ALICE_2 — under_review (3 comments)
  {
    id: 'cc000002-0000-0000-0000-000000000001',
    officer_id: JANE,
    application_id: APP_ALICE_2,
    comment: 'Under review. Organisational structure documents have been examined. The submitted constitution document appears to be an older version — please verify it reflects current governance arrangements.',
    created_at: daysAgo(28),
    updated_at: daysAgo(28),
  },
  {
    id: 'cc000002-0000-0000-0000-000000000002',
    officer_id: MICHAEL,
    application_id: APP_ALICE_2,
    comment: 'Financial sustainability section reviewed. The projected client-to-staff ratio of 1:15 exceeds the recommended guideline of 1:10 for this licence type. Please provide a revised staffing plan.',
    created_at: daysAgo(20),
    updated_at: daysAgo(20),
  },
  {
    id: 'cc000002-0000-0000-0000-000000000003',
    officer_id: JANE,
    application_id: APP_ALICE_2,
    comment: 'Awaiting revised staffing plan as requested. Remainder of application looks satisfactory. Will proceed to pre-site review once document is received.',
    created_at: daysAgo(5),
    updated_at: daysAgo(5),
  },

  // APP_ALICE_3 — pending_pre_site_resubmission (3 comments)
  {
    id: 'cc000003-0000-0000-0000-000000000001',
    officer_id: MICHAEL,
    application_id: APP_ALICE_3,
    comment: 'Initial review completed. Several items require attention before we can proceed to site visit: (1) Proof of property lease or ownership for the stated business address, (2) Signed foster carer agreements template, (3) Child safeguarding policy document.',
    created_at: daysAgo(40),
    updated_at: daysAgo(40),
  },
  {
    id: 'cc000003-0000-0000-0000-000000000002',
    officer_id: JANE,
    application_id: APP_ALICE_3,
    comment: 'Following up on the outstanding documents listed in the previous note. Resubmission deadline is in 14 days. Please contact us if you require assistance.',
    created_at: daysAgo(25),
    updated_at: daysAgo(25),
  },
  {
    id: 'cc000003-0000-0000-0000-000000000003',
    officer_id: MICHAEL,
    application_id: APP_ALICE_3,
    comment: 'Resubmission window is now open. Application has been flagged as pending resubmission. Operator has been notified via system email. Awaiting updated document package.',
    created_at: daysAgo(3),
    updated_at: daysAgo(3),
  },

  // APP_BOB_1 — approved (2 comments)
  {
    id: 'cc000004-0000-0000-0000-000000000001',
    officer_id: JANE,
    application_id: APP_BOB_1,
    comment: 'Site visit completed on 18 February 2026. Premises are well-maintained, safety protocols are in place, and staffing ratios meet requirements. Recommending approval.',
    created_at: daysAgo(28),
    updated_at: daysAgo(28),
  },
  {
    id: 'cc000004-0000-0000-0000-000000000002',
    officer_id: MICHAEL,
    application_id: APP_BOB_1,
    comment: 'Application approved. Licence issued and emailed to the applicant. Validity period: 3 years from date of issue. Next renewal due by March 2029.',
    created_at: daysAgo(7),
    updated_at: daysAgo(7),
  },

  // APP_BOB_2 — rejected (3 comments)
  {
    id: 'cc000005-0000-0000-0000-000000000001',
    officer_id: MICHAEL,
    application_id: APP_BOB_2,
    comment: 'Document review flagged significant gaps: no evidence of relevant residential care experience by the named manager, and the submitted floor plan does not meet the minimum 4.5 sqm per resident requirement under the Residential Child Care Regulations.',
    created_at: daysAgo(55),
    updated_at: daysAgo(55),
  },
  {
    id: 'cc000005-0000-0000-0000-000000000002',
    officer_id: JANE,
    application_id: APP_BOB_2,
    comment: 'Site visit conducted. Physical space is below regulatory minimum. Structural modifications would be required to meet compliance. The nominated manager does not hold the required Diploma in Social Work or equivalent qualification.',
    created_at: daysAgo(30),
    updated_at: daysAgo(30),
  },
  {
    id: 'cc000005-0000-0000-0000-000000000003',
    officer_id: MICHAEL,
    application_id: APP_BOB_2,
    comment: 'Application rejected. The application does not meet minimum statutory requirements under the Children and Young Persons Act. A formal rejection letter has been issued outlining the specific grounds. The applicant may reapply after addressing all cited deficiencies.',
    created_at: daysAgo(15),
    updated_at: daysAgo(15),
  },

  // APP_BOB_3 — pre_site_resubmitted (2 comments)
  {
    id: 'cc000006-0000-0000-0000-000000000001',
    officer_id: JANE,
    application_id: APP_BOB_3,
    comment: 'Pre-site review identified the need for an updated household safety assessment and confirmation of the emergency contact protocol. Application returned for resubmission.',
    created_at: daysAgo(20),
    updated_at: daysAgo(20),
  },
  {
    id: 'cc000006-0000-0000-0000-000000000002',
    officer_id: MICHAEL,
    application_id: APP_BOB_3,
    comment: 'Resubmission received. Updated household safety assessment looks thorough. Emergency contact protocol is now clearly documented. Scheduling site visit for next available slot.',
    created_at: daysAgo(2),
    updated_at: daysAgo(2),
  },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const now = new Date();

    // Users — skip any that already exist
    const existingUserRows = await queryInterface.sequelize.query(
      `SELECT id FROM users WHERE id IN (${USERS.map((u) => `'${u.id}'`).join(', ')})`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    const existingUserIds = new Set(existingUserRows.map((r) => r.id));
    const newUsers = USERS.filter((u) => !existingUserIds.has(u.id)).map((u) => ({
      ...u,
      created_at: now,
      updated_at: now,
    }));
    if (newUsers.length > 0) await queryInterface.bulkInsert('users', newUsers);

    // Applications — skip any that already exist
    const appIds = APPLICATIONS.map((a) => `'${a.id}'`).join(', ');
    const existingAppRows = await queryInterface.sequelize.query(
      `SELECT id FROM applications WHERE id IN (${appIds})`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    const existingAppIds = new Set(existingAppRows.map((r) => r.id));
    const newApps = APPLICATIONS.filter((a) => !existingAppIds.has(a.id));
    if (newApps.length > 0) await queryInterface.bulkInsert('applications', newApps);

    // Comments — skip any that already exist
    const commentIds = COMMENTS.map((c) => `'${c.id}'`).join(', ');
    const existingCommentRows = await queryInterface.sequelize.query(
      `SELECT id FROM comments WHERE id IN (${commentIds})`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    const existingCommentIds = new Set(existingCommentRows.map((r) => r.id));
    const newComments = COMMENTS.filter((c) => !existingCommentIds.has(c.id));
    if (newComments.length > 0) await queryInterface.bulkInsert('comments', newComments);
  },

  async down(queryInterface) {
    const commentIds = COMMENTS.map((c) => `'${c.id}'`).join(', ');
    await queryInterface.sequelize.query(`DELETE FROM comments WHERE id IN (${commentIds})`);

    const appIds = APPLICATIONS.map((a) => `'${a.id}'`).join(', ');
    await queryInterface.sequelize.query(`DELETE FROM applications WHERE id IN (${appIds})`);

    const userIds = USERS.map((u) => `'${u.id}'`).join(', ');
    await queryInterface.sequelize.query(`DELETE FROM users WHERE id IN (${userIds})`);
  },
};
