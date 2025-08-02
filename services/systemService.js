exports.getEnv = (req, res) => {
	res.status(200).json({
		status: "sucess",
		data: process.env
	});
};
