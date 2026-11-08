import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';
import { Site, SiteDocument } from '../sites/schemas/site.schema';
import { Visit, VisitDocument } from '../visits/schemas/visit.schema';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Site.name) private siteModel: Model<SiteDocument>,
    @InjectModel(Visit.name) private visitModel: Model<VisitDocument>,
  ) {}

  async seed() {
    console.log('🌱 Starting full database seed with 1 hour history trail...');

    // 1. Reset Collections
    await this.userModel.deleteMany({});
    await this.siteModel.deleteMany({});
    await this.visitModel.deleteMany({});

    // 2. Create Users
    const usersData = [
      { username: 'alice', name: 'Alice Walker' },
      { username: 'bob', name: 'Bob Vance' },
      { username: 'charlie', name: 'Charlie Day' },
    ];

    const users = await this.userModel.insertMany(usersData);
    const alice = users.find((u) => u.username === 'alice')!;
    const bob = users.find((u) => u.username === 'bob')!;
    const charlie = users.find((u) => u.username === 'charlie')!;

    // 3. Create 10 Interconnected Sites
    const sitesData = [
      {
        address: 'tidepool.zz',
        title: 'Tidepool Journal',
        bodyHtml: `<p>Welcome to the Tidepool web space. Explore the nearby <a href="reef.zz">Coral Reef</a> or venture deep into <a href="abyss.zz">The Abyss</a>.</p>`,
        authorId: alice._id,
      },
      {
        address: 'reef.zz',
        title: 'Coral Reef Sanctuary',
        bodyHtml: `<p>The reef is vibrant and full of life. You can return to <a href="tidepool.zz">Tidepool</a> or swim up to <a href="shallow.zz">Shallow Bay</a>. Beware of the <a href="ghost-ship.zz">Broken Ghost Ship</a> link.</p>`,
        authorId: alice._id,
      },
      {
        address: 'abyss.zz',
        title: 'The Unfathomable Abyss',
        bodyHtml: `<p>Sunlight cannot reach this depth. Descend further to <a href="trench.zz">Marianas Trench</a> or head back to <a href="tidepool.zz">Tidepool</a>.</p>`,
        authorId: bob._id,
      },
      {
        address: 'trench.zz',
        title: 'Marianas Trench Notes',
        bodyHtml: `<p>The crushing pressure here is immense. Check out research from <a href="station.zz">Research Station Alpha</a> or read about <a href="hydrothermal.zz">Hydrothermal Vents</a>.</p>`,
        authorId: bob._id,
      },
      {
        address: 'shallow.zz',
        title: 'Shallow Bay',
        bodyHtml: `<p>Warm waters and soft sand. Connects directly to <a href="reef.zz">Coral Reef</a> and <a href="lagoon.zz">Secret Lagoon</a>.</p>`,
        authorId: alice._id,
      },
      {
        address: 'lagoon.zz',
        title: 'Secret Lagoon',
        bodyHtml: `<p>Hidden behind dense foliage. Links back to <a href="shallow.zz">Shallow Bay</a> and leads to an old <a href="lighthouse.zz">Lighthouse</a>.</p>`,
        authorId: alice._id,
      },
      {
        address: 'lighthouse.zz',
        title: 'Beacon Point Lighthouse',
        bodyHtml: `<p>Guiding maritime travelers through dark nights. Points toward <a href="station.zz">Research Station Alpha</a>.</p>`,
        authorId: bob._id,
      },
      {
        address: 'station.zz',
        title: 'Research Station Alpha',
        bodyHtml: `<p>Monitoring deep ocean acoustic signals. See <a href="hydrothermal.zz">Hydrothermal Vents</a> data or check non-existent <a href="lost-atlas.zz">Lost Atlas</a>.</p>`,
        authorId: bob._id,
      },
      {
        address: 'hydrothermal.zz',
        title: 'Hydrothermal Vents Field',
        bodyHtml: `<p>Superheated mineral-rich water spewing into cold depths. Read more at <a href="trench.zz">Marianas Trench</a>.</p>`,
        authorId: bob._id,
      },
      {
        address: 'mal-site.zz',
        title: 'Malicious Security Test Page',
        bodyHtml: `<p>Testing XSS execution below:</p><img src="x" onerror="alert('XSS')" /><style>header{display:none!important}</style><h2>Security Test</h2><p>Safe content below. Return to <a href="tidepool.zz">Tidepool</a>.</p>`,
        authorId: alice._id,
      },
    ];

    await this.siteModel.insertMany(sitesData);

    // 4. Generate 1 Hour of Timed Browsing History (Past 60 Minutes)
    const now = Date.now();
    const minutesAgo = (m: number) => new Date(now - m * 60 * 1000);

    const historyVisits = [
      // Alice's Long Exploration Trail (60 mins ago -> 10 mins ago)
      { userId: alice._id, address: 'tidepool.zz', entryType: 'TYPED', createdAt: minutesAgo(58) },
      { userId: alice._id, address: 'reef.zz', entryType: 'LINK', createdAt: minutesAgo(54) },
      { userId: alice._id, address: 'shallow.zz', entryType: 'LINK', createdAt: minutesAgo(50) },
      { userId: alice._id, address: 'reef.zz', entryType: 'BACK_FORWARD', createdAt: minutesAgo(47) },
      { userId: alice._id, address: 'abyss.zz', entryType: 'LINK', createdAt: minutesAgo(42) },
      { userId: alice._id, address: 'trench.zz', entryType: 'LINK', createdAt: minutesAgo(35) },
      { userId: alice._id, address: 'station.zz', entryType: 'LINK', createdAt: minutesAgo(28) },
      { userId: alice._id, address: 'hydrothermal.zz', entryType: 'LINK', createdAt: minutesAgo(22) },
      { userId: alice._id, address: 'tidepool.zz', entryType: 'JUMP', createdAt: minutesAgo(15) },
      { userId: alice._id, address: 'mal-site.zz', entryType: 'TYPED', createdAt: minutesAgo(8) },

      // Bob's Repeated Deep-Ocean Research Walks (45 mins ago -> 5 mins ago)
      { userId: bob._id, address: 'abyss.zz', entryType: 'TYPED', createdAt: minutesAgo(45) },
      { userId: bob._id, address: 'trench.zz', entryType: 'LINK', createdAt: minutesAgo(40) },
      { userId: bob._id, address: 'hydrothermal.zz', entryType: 'LINK', createdAt: minutesAgo(32) },
      { userId: bob._id, address: 'trench.zz', entryType: 'BACK_FORWARD', createdAt: minutesAgo(25) },
      { userId: bob._id, address: 'station.zz', entryType: 'LINK', createdAt: minutesAgo(18) },
      { userId: bob._id, address: 'lost-atlas.zz', entryType: 'LINK', createdAt: minutesAgo(12) }, // 404 Visit
      { userId: bob._id, address: 'lighthouse.zz', entryType: 'JUMP', createdAt: minutesAgo(4) },

      // Charlie's General Browsing (30 mins ago -> 2 mins ago)
      { userId: charlie._id, address: 'tidepool.zz', entryType: 'TYPED', createdAt: minutesAgo(30) },
      { userId: charlie._id, address: 'reef.zz', entryType: 'LINK', createdAt: minutesAgo(24) },
      { userId: charlie._id, address: 'ghost-ship.zz', entryType: 'LINK', createdAt: minutesAgo(19) }, // 404 Visit
      { userId: charlie._id, address: 'lagoon.zz', entryType: 'JUMP', createdAt: minutesAgo(11) },
      { userId: charlie._id, address: 'lighthouse.zz', entryType: 'LINK', createdAt: minutesAgo(2) },
    ];

    await this.visitModel.insertMany(historyVisits);

    console.log('✅ Seed completed successfully: 3 Users, 10 Sites, 1 Hour Visit Trail!');
  }
}