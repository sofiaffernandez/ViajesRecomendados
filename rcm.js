const express = require("express")
const app = express()
// Crear una nueva recomendación de viaje
app.post('/recommendations', (req, res) => {
    const recommendation = req.body;
    recommendations.push(recommendation);
    res.send('Recomendación de viaje creada con éxito');
});

// Obtener una lista de todas las recomendaciones de viaje
app.get('/recommendations', (req, res) => {
    res.send(recommendations);
});

  // Obtener una recomendación de viaje específica
app.get('/recommendations/:id', (req, res) => {
    const recommendation = recommendations.find(r => r.id === req.params.id);
    if (recommendation) {
        res.send(recommendation);
    } else {
        res.status(404).send('Recomendación de viaje no encontrada');
    }
});
  // Actualizar una recomendación de viaje
app.put('/recommendations/:id', (req, res) => {
    const recommendation = recommendations.find(r => r.id === req.params.id);
    if (recommendation) {
    recommendation.title = req.body.title;
    recommendation.description = req.body.description;
    recommendation.location = req.body.location;
    recommendation.photos = req.body.photos;
        res.send('Recomendación de viaje actualizada con éxito');
    } else {
        res.status(404).send('Recomendación de viaje no encontrada');
    }
});

  // Eliminar una recomendación de viaje
app.delete('/recommendations/:id', (req, res) => {
    const recommendationIndex = recommendations.findIndex(r => r.id === req.params.id);
    if (recommendationIndex !== -1) {
    recommendations.splice(recommendationIndex, 1);
        res.send('Recomendación de viaje eliminada con éxito');
    } else {
        res.status(404).send('Recomendación de viaje no encontrada');
    }
});

    const port = process.env.PORT || 3000;
    app.listen(port, () => {
    console.log(`API de recomendaciones de viajes escuchando en el puerto ${port}`);
});

