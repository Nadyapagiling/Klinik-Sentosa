require('dotenv').config();
const mongoose = require('mongoose');
const Data = require('./models/Data');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/klinik_sentosa');
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB Error:', error.message);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Data.deleteMany({});
    console.log('Cleared existing data');

    // Seed Patients
    const patients = [
      {
        name: 'Budi Santoso',
        email: 'budi@example.com',
        phone: '081234567890',
        address: 'Jl. Merdeka No. 10, Manado',
        type: 'patient',
        metadata: {
          nik: '7171012345678901',
          dob: '1985-05-15',
          gender: 'Laki-laki',
          allergy: 'Penisilin',
          medicalHistory: 'Hipertensi'
        }
      },
      {
        name: 'Siti Rahayu',
        email: 'siti@example.com',
        phone: '081234567891',
        address: 'Jl. Diponegoro No. 25, Manado',
        type: 'patient',
        metadata: {
          nik: '7171012345678902',
          dob: '1990-03-20',
          gender: 'Perempuan',
          allergy: '-',
          medicalHistory: 'Sehat'
        }
      }
    ];

    const savedPatients = await Data.insertMany(patients);
    console.log(`✅ Seeded ${savedPatients.length} patients`);

    // Seed Drugs
    const drugs = [
      {
        name: 'Paracetamol 500mg',
        type: 'drug',
        metadata: {
          stock: 100,
          unitPrice: 5000,
          expiryDate: '2026-12-31'
        }
      },
      {
        name: 'Amoxicillin 500mg',
        type: 'drug',
        metadata: {
          stock: 50,
          unitPrice: 15000,
          expiryDate: '2026-10-15'
        }
      },
      {
        name: 'Vitamin C 1000mg',
        type: 'drug',
        metadata: {
          stock: 200,
          unitPrice: 3000,
          expiryDate: '2027-03-20'
        }
      }
    ];

    const savedDrugs = await Data.insertMany(drugs);
    console.log(`✅ Seeded ${savedDrugs.length} drugs`);

    // Seed Visits
    const visits = [
      {
        name: savedPatients[0].name,
        type: 'visit',
        metadata: {
          patientId: savedPatients[0]._id.toString(),
          visitDate: new Date().toISOString().split('T')[0],
          queueNo: 'A001',
          status: 'Menunggu',
          complaint: 'Demam dan batuk',
          diagnosis: '',
          notes: ''
        }
      }
    ];

    const savedVisits = await Data.insertMany(visits);
    console.log(`✅ Seeded ${savedVisits.length} visits`);

    // Seed Complaint
    const complaints = [
      {
        name: savedPatients[0].name,
        type: 'complaint',
        metadata: {
          patientId: savedPatients[0]._id.toString(),
          content: 'Pelayanan sangat baik dan ramah',
          status: 'Baru',
          response: '',
          date: new Date().toISOString().split('T')[0]
        }
      }
    ];

    await Data.insertMany(complaints);
    console.log(`✅ Seeded ${complaints.length} complaints`);

    console.log('\n🎉 Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
