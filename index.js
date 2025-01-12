import express from 'express';
import axios from 'axios';

const app = express();
app.use(express.json());

const fetchData = async () => {
    try {
        // Bugünün tarihi
        const today = new Date();
        const formattedToday = today.toISOString().split('T')[0]; // YYYY-MM-DD formatında

        // İki hafta sonrasının tarihi
        const twoWeeksLater = new Date();
        twoWeeksLater.setDate(today.getDate() + 14); // 14 gün ekle
        const formattedEndDate = twoWeeksLater.toISOString().split('T')[0]; // YYYY-MM-DD formatında

        // API isteği
        const response = await axios.get(`https://www.sporekrani.com/api/v4.1/events?sport_slug=futbol&day=${formattedToday}&end_date=${formattedEndDate}&app_id=WX5qmaaN&api_key=Ew4MlbmaAgzq6zU2uvFlxasfOsyGEuAymNYpMwFu`);
        return response.data;
    } catch (error) {
        console.error('Hata:', error.message);
        throw new Error('Veri alınamadı');
    }
};


app.get('/', async (req, res) => {
    try {
        const data = await fetchData();
        res.json(data);
    } catch (error) {
        console.error('Veri alınamadı:', error.message);
        res.status(500).send('Veri alınamadı.');
    }
});

app.get('/match', async (req, res) => {
    try {
        const data = await fetchData();

        console.log('API Yanıtı:', JSON.stringify(data, null, 2));
        console.log('Events:', data.data); 

        if (!data || !data.data || !Array.isArray(data.data)) {
            console.error('Veri beklenenden farklı formatta:', data);
            return res.status(500).send('Veri formatı beklenenden farklı.');
        }

        const filteredData = data.data.map(event => ({
            league_name: event.league_name || "Bilgi yok",
            home_name: event.home_name || "Bilgi yok",
            away_name: event.away_name || "Bilgi yok",
            home_icon: event.home_icon || "Bilgi yok",
            away_icon: event.away_icon || "Bilgi yok",
            name: event.name || "Bilgi yok",
            channel_name: event.channels ? event.channels.map(channel => channel.name || "Bilgi yok") : [],
            alt_names: event.channels ? event.channels.flatMap(channel => channel.providers ? channel.providers.map(provider => provider.alt || "Bilgi yok") : []) : [],
            channel_link: event.channels 
            ? event.channels.flatMap(channel => 
                channel.providers 
                  ? channel.providers.map(provider => provider.channel_link).filter(link => link) 
                  : []
              ) 
            : [],          
            stadium: event.stadium || "Bilgi yok",
            city: event.city || "Bilgi yok",
            date_time: event.date_time || "Bilgi yok",
        }));

        res.json(filteredData);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).send('Veri alınamadı: ' + error.message);
    }
});



const PORT = 1122;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});





