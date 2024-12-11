const randomHexColor = () => {
	const randomColor = Math.floor(Math.random() * 16777215).toString(16);
	const color = `#${randomColor.padStart(6, "0")}`; // Asegura 6 caracteres
	return color;
};
export default randomHexColor;
