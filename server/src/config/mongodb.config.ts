import { registerAs } from '@nestjs/config';

export default registerAs('mongodb', () => ({
  uri: process.env.MONGO_URI, // Lấy URI từ biến môi trường
}));
