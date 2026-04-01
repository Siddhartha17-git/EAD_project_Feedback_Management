require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/userModel');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/feedback_db';

const faculty = [{"name": "Ms. T. Madhuri", "email": "tmadhuri_it@cbit.ac.in", "password": "tmadhuri"}, {"name": "Mrs. K. Swathi", "email": "kswathi_it@cbit.ac.in", "password": "kswathi"}, {"name": "Dr. D. Jayaram", "email": "djayaram_it@cbit.ac.in", "password": "djayaram"}, {"name": "Dr. P. Ramesh Babu", "email": "prameshbabu_it@cbit.ac.in", "password": "prameshbabu"}, {"name": "Dr. A. Sirlsha", "email": "asirlsha_it@cbit.ac.in", "password": "asirlsha"}, {"name": "Mr. Sai Venkat", "email": "saivenkat@cbit.ac.in", "password": "saivenkat"}, {"name": "Mr. U. Sai Ram", "email": "usairam_it@cbit.ac.in", "password": "usairam"}, {"name": "Dr. Pragati Priyadarshinee", "email": "ppragatipriyadarshinee_it@cbit.ac.in", "password": "ppragatipriyadarshinee"}, {"name": "Mr. V. Santhosh", "email": "vsantosh_it@cbit.ac.in", "password": "vsantosh"}, {"name": "Mr. K. Gangadhara Rao", "email": "kgangadhar_it@cbit.ac.in", "password": "kgangadhar"}, {"name": "Dr. K. Sugamya", "email": "ksugamya_it@cbit.ac.in", "password": "ksugamya"}, {"name": "Dr. K. Rama Lakshmi", "email": "kramalakshmi_it@cbit.ac.in", "password": "kramalakshmi"}, {"name": "Ms. P. Kiranmai", "email": "pkiranmai_it@cbit.ac.in", "password": "pkiranmai"}];

async function run() {
  await mongoose.connect(MONGODB_URI, { useNewUrlParser:true, useUnifiedTopology:true });
  console.log('Connected to MongoDB');
  for (const f of faculty) {
    const existing = await User.findOne({ email: f.email });
    if (existing) { console.log('Exists:', f.email); continue; }
    const hash = await bcrypt.hash(f.password, 10);
    const u = new User({ name: f.name, email: f.email, passwordHash: hash, role: 'faculty' });
    await u.save();
    console.log('Created:', f.email);
  }
  mongoose.disconnect();
  console.log('Done');
}
run().catch(err=>{ console.error(err); mongoose.disconnect(); });
