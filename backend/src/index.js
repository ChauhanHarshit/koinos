const app = require('./app');
const { getCookie } = require('./middleware/errorHandler');

const port = process.env.PORT || 3001;

getCookie();

app.listen(port, () => console.log('Backend running on http://localhost:' + port));