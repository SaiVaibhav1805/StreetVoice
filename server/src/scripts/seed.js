import mongoose from 'mongoose';
import dns from 'dns';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Issue from '../models/Issue.js';
import Comment from '../models/Comment.js';
import Verification from '../models/Verification.js';
import StatusUpdate from '../models/StatusUpdate.js';

dotenv.config();

// Set DNS servers to resolve MongoDB SRV Atlas records correctly
dns.setServers(['8.8.8.8', '8.8.4.4']);

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('MONGO_URI env variable is missing!');
  process.exit(1);
}

const seedDatabase = async () => {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected to database.');

    // Clear existing collections
    console.log('Clearing existing collections...');
    await User.deleteMany({});
    await Issue.deleteMany({});
    await Comment.deleteMany({});
    await Verification.deleteMany({});
    await StatusUpdate.deleteMany({});
    console.log('Collections cleared.');

    // 1. Create Users (Citizens & Authorities)
    console.log('Creating users...');
    
    // Developer / Judge user
    const userVaibhav = await User.create({
      phone: '9876543210',
      name: 'Sai Vaibhav',
      role: 'citizen',
      ward: 'Gachibowli',
      xp: 280,
      badges: ['First Responder', 'Neighborhood Watch', 'Streak Reporter'],
      issuesReported: 3,
      issuesVerified: 12
    });

    const userRahul = await User.create({
      phone: '9000000001',
      name: 'Rahul Kumar',
      role: 'citizen',
      ward: 'Madhapur',
      xp: 150,
      badges: ['First Responder'],
      issuesReported: 2,
      issuesVerified: 6
    });

    const userPriya = await User.create({
      phone: '9000000002',
      name: 'Priya Sharma',
      role: 'citizen',
      ward: 'Kukatpally',
      xp: 90,
      badges: ['Neighborhood Watch'],
      issuesReported: 1,
      issuesVerified: 4
    });

    const userAnanya = await User.create({
      phone: '9000000003',
      name: 'Ananya Reddy',
      role: 'citizen',
      ward: 'Jubilee Hills',
      xp: 450,
      badges: ['First Responder', 'Streak Reporter', 'Community Hero'],
      issuesReported: 5,
      issuesVerified: 22
    });

    // Authorities
    const userOfficer = await User.create({
      phone: '8888888888',
      name: 'GHMC Authority Officer',
      role: 'authority',
      ward: 'Hyderabad Corp',
      xp: 0,
      badges: []
    });

    const userMod = await User.create({
      phone: '9999999999',
      name: 'Chief Moderator',
      role: 'moderator',
      ward: 'Hyderabad Corp',
      xp: 0,
      badges: []
    });

    console.log('Users created successfully.');

    // 2. Create Issues
    console.log('Creating issues...');
    const now = new Date();
    
    const issuesData = [
      {
        title: 'Huge Pothole near Gachibowli Flyover',
        description: 'Large pothole in the middle of the road causing traffic backlog. Hazardous to two-wheelers especially during night times.',
        category: 'pothole',
        severity: 'high',
        status: 'assigned',
        location: {
          type: 'Point',
          coordinates: [78.3820, 17.4400], // [lng, lat]
          address: 'Near Gachibowli Flyover, Gachibowli, Hyderabad',
          ward: 'Gachibowli'
        },
        reportedBy: userRahul._id,
        assignedTo: userOfficer._id,
        upvoteCount: 3,
        verificationCount: 3,
        commentCount: 2,
        estimatedResolution: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000),
        aiAnalysis: {
          category: 'pothole',
          severity: 'high',
          confidence: 0.94,
          summary: 'Road pothole detected. Poses high risk to traffic and safety.',
          processedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000)
        },
        createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'Streetlight not working since 3 days',
        description: 'Entire block streetlight is dead. The street is completely dark at night, making it unsafe for women and children.',
        category: 'streetlight',
        severity: 'medium',
        status: 'reported',
        location: {
          type: 'Point',
          coordinates: [78.3750, 17.4485],
          address: 'Street No 4, Kavuri Hills, Madhapur, Hyderabad',
          ward: 'Madhapur'
        },
        reportedBy: userVaibhav._id,
        upvoteCount: 1,
        verificationCount: 0,
        commentCount: 0,
        aiAnalysis: {
          category: 'streetlight',
          severity: 'medium',
          confidence: 0.89,
          summary: 'Non-functional street light. Causes low-light safety concerns.',
          processedAt: new Date(now.getTime() - 12 * 60 * 60 * 1000)
        },
        createdAt: new Date(now.getTime() - 12 * 60 * 60 * 1000)
      },
      {
        title: 'Overflowing Garbage Dumpster on Main Road',
        description: 'Trash bin is completely overflowing. Garbage has spread onto the main road. Foul smell is spreading and attracting stray animals.',
        category: 'garbage',
        severity: 'critical',
        status: 'in_progress',
        location: {
          type: 'Point',
          coordinates: [78.3900, 17.4450],
          address: 'Beside IKEA Back Gate, Madhapur, Hyderabad',
          ward: 'Madhapur'
        },
        reportedBy: userAnanya._id,
        assignedTo: userOfficer._id,
        upvoteCount: 5,
        verificationCount: 4,
        commentCount: 2,
        aiAnalysis: {
          category: 'garbage',
          severity: 'critical',
          confidence: 0.98,
          summary: 'Overflowing community waste bin. Poses severe hygiene and obstruction risks.',
          processedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000)
        },
        createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'Major Clean Water Pipe Leakage',
        description: 'Drinking water pipeline burst, spraying thousands of liters of pure water onto the footpath and road.',
        category: 'water_leakage',
        severity: 'high',
        status: 'resolved',
        location: {
          type: 'Point',
          coordinates: [78.3480, 17.5000],
          address: 'Road No 2, KPHB Phase 3, Kukatpally, Hyderabad',
          ward: 'Kukatpally'
        },
        reportedBy: userPriya._id,
        assignedTo: userOfficer._id,
        upvoteCount: 4,
        verificationCount: 3,
        commentCount: 1,
        resolvedAt: new Date(now.getTime() - 6 * 60 * 60 * 1000),
        aiAnalysis: {
          category: 'water_leakage',
          severity: 'high',
          confidence: 0.92,
          summary: 'Burst pressurized water line. High waste of drinking water resources.',
          processedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000)
        },
        createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'Severe Road Damage on Jubilee Hills Road 36',
        description: 'Asphalt has completely washed off in a 10-meter stretch following yesterday\'s flash rains. Deep gravel is exposed.',
        category: 'road_damage',
        severity: 'medium',
        status: 'verified',
        location: {
          type: 'Point',
          coordinates: [78.4000, 17.4300],
          address: 'Road No 36, Jubilee Hills, Hyderabad',
          ward: 'Jubilee Hills'
        },
        reportedBy: userAnanya._id,
        upvoteCount: 3,
        verificationCount: 3,
        commentCount: 1,
        aiAnalysis: {
          category: 'road_damage',
          severity: 'medium',
          confidence: 0.85,
          summary: 'Eroded road surface with exposed gravel.',
          processedAt: new Date(now.getTime() - 18 * 60 * 60 * 1000)
        },
        createdAt: new Date(now.getTime() - 18 * 60 * 60 * 1000)
      },
      {
        title: 'Open Manhole on Begumpet Main Road',
        description: 'Open sewer manhole directly on the side of the main road. No barricades or signs placed. Extremely dangerous.',
        category: 'sewage',
        severity: 'critical',
        status: 'assigned',
        location: {
          type: 'Point',
          coordinates: [78.4500, 17.4400],
          address: 'Near Metro Pillar C1208, Begumpet, Hyderabad',
          ward: 'Begumpet'
        },
        reportedBy: userVaibhav._id,
        assignedTo: userOfficer._id,
        upvoteCount: 6,
        verificationCount: 4,
        commentCount: 3,
        estimatedResolution: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000),
        aiAnalysis: {
          category: 'sewage',
          severity: 'critical',
          confidence: 0.99,
          summary: 'Missing manhole cover. High fall risk for citizens and vehicles.',
          processedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000)
        },
        createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'Footpath Encroachment by Street Vendors',
        description: 'Commercial display stands and food carts completely blocking the footpath, forcing pedestrians to walk on the main road.',
        category: 'encroachment',
        severity: 'low',
        status: 'reported',
        location: {
          type: 'Point',
          coordinates: [78.4100, 17.4200],
          address: 'Road No 1, Banjara Hills, Hyderabad',
          ward: 'Banjara Hills'
        },
        reportedBy: userPriya._id,
        upvoteCount: 2,
        verificationCount: 0,
        commentCount: 1,
        aiAnalysis: {
          category: 'encroachment',
          severity: 'low',
          confidence: 0.81,
          summary: 'Footpath walk space occupied by vendor items.',
          processedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000)
        },
        createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000)
      }
    ];

    const createdIssues = await Issue.insertMany(issuesData);
    console.log(`${createdIssues.length} issues created successfully.`);

    const potholeIssue = createdIssues[0];
    const streetlightIssue = createdIssues[1];
    const garbageIssue = createdIssues[2];
    const waterIssue = createdIssues[3];
    const roadIssue = createdIssues[4];
    const manholeIssue = createdIssues[5];

    // 3. Create Upvotes
    console.log('Seeding upvotes...');
    potholeIssue.upvotes = [userRahul._id, userPriya._id, userVaibhav._id];
    await potholeIssue.save();
    
    garbageIssue.upvotes = [userAnanya._id, userRahul._id, userPriya._id, userVaibhav._id, userMod._id];
    await garbageIssue.save();

    waterIssue.upvotes = [userPriya._id, userVaibhav._id, userRahul._id, userAnanya._id];
    await waterIssue.save();

    manholeIssue.upvotes = [userVaibhav._id, userRahul._id, userAnanya._id, userPriya._id, userOfficer._id, userMod._id];
    await manholeIssue.save();

    // 4. Create Verifications
    console.log('Creating verifications...');
    await Verification.create([
      { issue: potholeIssue._id, verifiedBy: userVaibhav._id, comment: 'Yes, saw this flyover pothole. It is deep and dangerous.', location: { coordinates: [78.3821, 17.4401] } },
      { issue: potholeIssue._id, verifiedBy: userPriya._id, comment: 'Confirmed. Almost fell off my scooter here.', location: { coordinates: [78.3820, 17.4402] } },
      { issue: potholeIssue._id, verifiedBy: userAnanya._id, comment: 'Still active. Need immediate filling.', location: { coordinates: [78.3819, 17.4400] } },

      { issue: garbageIssue._id, verifiedBy: userVaibhav._id, comment: 'Cows are eating the plastic there now. Very messy.', location: { coordinates: [78.3901, 17.4450] } },
      { issue: garbageIssue._id, verifiedBy: userRahul._id, comment: 'Verified. Clogged path entirely.', location: { coordinates: [78.3900, 17.4452] } },
      { issue: garbageIssue._id, verifiedBy: userPriya._id, comment: 'Yes, stink is unbearable.', location: { coordinates: [78.3899, 17.4451] } },
      { issue: garbageIssue._id, verifiedBy: userMod._id, comment: 'Escalated. Attracts vector diseases.', location: { coordinates: [78.3900, 17.4449] } },

      { issue: waterIssue._id, verifiedBy: userVaibhav._id, comment: 'Flowing water on main road.', location: { coordinates: [78.3481, 17.5001] } },
      { issue: waterIssue._id, verifiedBy: userRahul._id, comment: 'Confirmed water wastage.', location: { coordinates: [78.3480, 17.5002] } },
      { issue: waterIssue._id, verifiedBy: userAnanya._id, comment: 'Heavy spraying. Impeding footpath walk.', location: { coordinates: [78.3479, 17.5000] } },

      { issue: roadIssue._id, verifiedBy: userVaibhav._id, comment: 'Verified. Very bumpy.', location: { coordinates: [78.4001, 17.4300] } },
      { issue: roadIssue._id, verifiedBy: userRahul._id, comment: 'Tarmac has been fully removed.', location: { coordinates: [78.4000, 17.4302] } },
      { issue: roadIssue._id, verifiedBy: userPriya._id, comment: 'Rough patch.', location: { coordinates: [78.3999, 17.4299] } },

      { issue: manholeIssue._id, verifiedBy: userRahul._id, comment: 'Extremely dangerous open pit on roadside.', location: { coordinates: [78.4501, 17.4401] } },
      { issue: manholeIssue._id, verifiedBy: userAnanya._id, comment: 'Placed a stick inside it so people notice.', location: { coordinates: [78.4500, 17.4402] } },
      { issue: manholeIssue._id, verifiedBy: userPriya._id, comment: 'Verified. High accident zone.', location: { coordinates: [78.4499, 17.4400] } },
      { issue: manholeIssue._id, verifiedBy: userMod._id, comment: 'Verified. Urgent fix needed.', location: { coordinates: [78.4500, 17.4399] } },
    ]);
    console.log('Verifications created.');

    // 5. Create Comments
    console.log('Creating comments...');
    await Comment.create([
      { issue: potholeIssue._id, author: userVaibhav._id, text: 'Is anyone working on this pothole? Traffic is terrible.' },
      { issue: potholeIssue._id, author: userRahul._id, text: 'GHMC team should fill it before tomorrow\'s rain.' },

      { issue: garbageIssue._id, author: userAnanya._id, text: 'The municipal truck missed clearing this dumpster this week.' },
      { issue: garbageIssue._id, author: userOfficer._id, text: 'Dispatched sanitation truck. Clearing will start in 2 hours.', isAuthorityUpdate: true },

      { issue: waterIssue._id, author: userOfficer._id, text: 'Water board engineers have patched the leak. Flow stopped.', isAuthorityUpdate: true },

      { issue: roadIssue._id, author: userAnanya._id, text: 'Temporary warning tape is put around the gravel.' },

      { issue: manholeIssue._id, author: userVaibhav._id, text: 'This is near the school zone. Need immediate board setup!' },
      { issue: manholeIssue._id, author: userOfficer._id, text: 'Sewer team notified. Safety cone has been dispatched.', isAuthorityUpdate: true },
      { issue: manholeIssue._id, author: userMod._id, text: 'Tracking status priority.' },
    ]);
    console.log('Comments created.');

    // 6. Create Status Updates
    console.log('Creating status history...');
    await StatusUpdate.create([
      // Pothole flyover history
      { issue: potholeIssue._id, updatedBy: userRahul._id, previousStatus: 'reported', newStatus: 'reported', note: 'Reported pothole' },
      { issue: potholeIssue._id, updatedBy: userMod._id, previousStatus: 'reported', newStatus: 'verified', note: 'Community verified the pothole' },
      { issue: potholeIssue._id, updatedBy: userOfficer._id, previousStatus: 'verified', newStatus: 'assigned', note: 'Assigned to Ward Road Maintenance crew.', estimatedResolution: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000) },

      // Garbage dumpster history
      { issue: garbageIssue._id, updatedBy: userAnanya._id, previousStatus: 'reported', newStatus: 'reported', note: 'Reported garbage heap' },
      { issue: garbageIssue._id, updatedBy: userMod._id, previousStatus: 'reported', newStatus: 'verified', note: 'Community verified threshold reached.' },
      { issue: garbageIssue._id, updatedBy: userOfficer._id, previousStatus: 'verified', newStatus: 'assigned', note: 'Assigned to waste cleanup squad' },
      { issue: garbageIssue._id, updatedBy: userOfficer._id, previousStatus: 'assigned', newStatus: 'in_progress', note: 'Truck deployed and currently clearing site.' },

      // Water pipeline history
      { issue: waterIssue._id, updatedBy: userPriya._id, previousStatus: 'reported', newStatus: 'reported', note: 'Reported water leak' },
      { issue: waterIssue._id, updatedBy: userMod._id, previousStatus: 'reported', newStatus: 'verified', note: 'Verifications met.' },
      { issue: waterIssue._id, updatedBy: userOfficer._id, previousStatus: 'verified', newStatus: 'assigned', note: 'Plumbing brigade assigned.' },
      { issue: waterIssue._id, updatedBy: userOfficer._id, previousStatus: 'assigned', newStatus: 'in_progress', note: 'Welding and patching main valve.' },
      { issue: waterIssue._id, updatedBy: userOfficer._id, previousStatus: 'in_progress', newStatus: 'resolved', note: 'Leak solved. Concrete sidewalk repaired.' },

      // Manhole history
      { issue: manholeIssue._id, updatedBy: userVaibhav._id, previousStatus: 'reported', newStatus: 'reported', note: 'Reported open manhole' },
      { issue: manholeIssue._id, updatedBy: userMod._id, previousStatus: 'reported', newStatus: 'verified', note: 'Verified by community.' },
      { issue: manholeIssue._id, updatedBy: userOfficer._id, previousStatus: 'verified', newStatus: 'assigned', note: 'Assigned emergency sewer division.', estimatedResolution: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000) },
    ]);
    console.log('Status history created.');

    console.log('Database seeded successfully!');
    process.exit(0);

  } catch (error) {
    console.error('Seeding database error:', error);
    process.exit(1);
  }
};

seedDatabase();
