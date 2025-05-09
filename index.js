const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const coolsms = require('coolsms-node-sdk').default;

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public')); // static HTML 폴더

// CoolSMS 설정
const messageService = new coolsms('NCSE3JPSUQBCNQXZ', 'OPPIAXSGJLFZLKKXYMJRGHGRPFP4WJAO');

// Gmail SMTP 설정
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'parkkyoungrun@gmail.com', // 본인 Gmail
    pass: 'vxms xcdh tdle svby'     // 2단계 인증 앱 비밀번호
  }
});

app.post('/api/submit', async (req, res) => {
  const { email, phone } = req.body;
  const message = '문자 및 이메일 보내기 테스트 중입니다.';

  try {
    if (email) {
      await transporter.sendMail({
        from: '"Test App" <parkkyoungrun>',
        to: email,
        subject: '테스트 메일입니다',
        text: message
      });
      console.log(`✅ 이메일 전송 완료: ${email}`);
    }

    if (phone) {
      await messageService.sendOne({
        to: phone,
        from: '010-5713-5320', // CoolSMS에 등록된 발신번호
        text: message
      });
      console.log(`✅ 문자 전송 완료: ${phone}`);
    }

    res.json({ success: true });
  } catch (error) {
    console.error('❌ 전송 실패:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ 서버 실행 중: http://localhost:${PORT}`);
});
