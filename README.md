# 🚨 NammaSuraksha - Crime Safety Analytics Platform

<div align="center">
  <img src="https://logomakerr.ai/logo/1234528" alt="NammaSuraksha" style="width:50px;height:50px">
</div>

## 📝 Problem Statement!

Cities in India are growing rapidly, and with this growth comes the challenge of ensuring citizen safety. Certain areas within cities are statistically more unsafe than others, and there's a need for a comprehensive solution to address these safety concerns. NammaSuraksha aims to provide a software solution that helps citizens stay safe through real-time crime data visualization, incident reporting, and safety resources.

## ✨ Features

### 🗺️ Interactive Safety Map
- Color-coded zones indicating safety levels (Red/Yellow/Green)
- Real-time crime data visualization
- Clickable areas for detailed crime statistics
- Heatmap visualization of crime-prone areas

### 🆘 Emergency Features
- Quick access to emergency contacts
- SOS button for immediate assistance
- Live location detection
- Safety alerts for unsafe areas

### 📋 Incident Reporting
- User-friendly form for reporting safety incidents
- Location-based reporting (with map integration)
- Multiple incident categories
- Media upload support (images/videos)
- Real-time status updates

### 📚 Safety Resources
- Emergency contact information
- Safety tips and guidelines
- Self-defense resources
- Educational materials

## 🛠️ Tech Stack

| Layer     | Technology                  | Purpose                    |
|-----------|----------------------------|----------------------------|
| Frontend  | React.js + TailwindCSS     | Modern, responsive UI      |
| Maps      | Leaflet.js                 | Interactive map visualization |
| Backend   | Node.js + Express.js       | API and server management  |
| Database  | MongoDB Atlas              | Secure data storage        |
| Hosting   | Vercel (Frontend) + Render (Backend) | Scalable deployment |

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account

### Installation

1. Clone the repository
    ```bash
    git clone https://github.com/yourusername/namma-suraksha.git
    cd namma-suraksha
    ```

2. Install dependencies
    ```bash
    # Install frontend dependencies
    cd frontend
    npm install

    # Install backend dependencies
    cd ../backend
    npm install
    ```

3. Set up environment variables
    ```bash
    # Create .env file in backend directory
    cp .env.example .env
    # Add your MongoDB URI and other configurations
    ```

4. Start the development servers
    ```bash
    # Start backend server
    cd backend
    npm run dev

    # Start frontend server
    cd frontend
    npm start
    ```

## 📊 Database Schema

```json
{
  "crimeType": "string",
  "description": "string",
  "latitude": "number",
  "longitude": "number",
  "timestamp": "date",
  "media": "array",
  "status": "string"
}
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Leaflet.js for the mapping functionality
- MongoDB Atlas for database hosting
- Vercel and Render for hosting services

## 📞 Contact

For any queries or support, please reach out to:
- Email: [your-email@example.com]
- Project Link: [https://github.com/yourusername/namma-suraksha]

---

Made with ❤️ for safer cities
