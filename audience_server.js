const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000

// Routes and middleware

app.get('/test', (request, response) => {
	console.log('Get request received');
	response.send('Audience Integration');
})

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});