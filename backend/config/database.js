const mongoose = require('mongoose');

const connectDB = async () => {
  console.log('🔍 MONGODB_URI:', process.env.MONGODB_URI || 'NO DEFINIDO');
  
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, { 
      family: 4 
    });
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
