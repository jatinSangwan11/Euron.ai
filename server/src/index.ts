import app from './app.ts';
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`${PORT} is active and listening`)
})