
export const getFavorites = async (req, res) => {
    try {
        console.log("4");
        // Step 1: Get the authenticated user
        const user = req.user;
        console.log({ fav: user.favorite });

        // Step 2: Populate favorite properties using Property model
        const favoriteProperties = await user.populate({
            path: "favorite ",
            model: "Tour"
        });

        // Step 3: Return the favorite properties
        res.status(200).json({ favorites: favoriteProperties.favorite });
    } catch (error) {

        return res.status(500).json({ message: "Internal Server Error.", error: error.message });
    }
}

export const addFavorites = async (req, res) => {
    try {

        // Step 1: Get the propertyId from request body
        // Step 2: Get the user from req.user (after authentication)
        // Step 3: Check if the property is already in the favorites
        // Step 4: If already present, remove it
        // Step 5: If not present, add it to favorites
        // Step 6: Save the updated user record

        const { propertyId } = req.body;
        console.log("Property ID:", propertyId);

        const user = req.user;

        const alreadyInFavorites = user.favorite.includes(propertyId);

        if (alreadyInFavorites) {
            await user.updateOne({ $pull: { favorite: propertyId } });
            return res.status(200).json({ message: "Tour removed from favorites." });
        }

        user.favorite.push(propertyId);

        await user.save();

        return res.status(201).json({ message: "Tour added to favorites." });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error.", error: error.message });
    }
}


export const removeFavorite = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "Tour not found" });
        }

        // Check if the property is in the user's favorites
        if (!user.favorite.includes(id)) {
            return res.status(400).json({ message: "Tour not in favorites" });
        }

        // Remove property from favorites
        user.favorite = user.favorite.filter(fav => fav.toString() !== id);
        await user.save();

        res.status(200).json({ message: "Tour removed from favorites", user });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal Server Error.", error: error.message });
    }
}