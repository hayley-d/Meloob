/**
 * Validator class for form validation.
 */
export class Validator {
    /**
     * Validate signup fields.
     * @param {Object} fields - The fields to validate.
     * @param {string} fields.username - The username.
     * @param {string} fields.email - The email address.
     * @param {string} fields.password - The password.
     * @param {string} fields.confirmPassword - The password confirmation.
     * @returns {Object} - An object containing validation errors.
     */
    static validateSignup(fields) {
        const errors = {};

        if (!fields.username) {
            errors.username = 'Please choose a username.';
        }

        if(fields.username.length < 6) {
            errors.username = 'Username needs to have at least 6 characters.';
        }

        if (!fields.email || !/\S+@\S+\.\S+/.test(fields.email)) {
            errors.email = 'Please provide a valid email.';
        }

        if (!fields.password || !/^(?=.*[A-Z])(?=.*\d)(?=.*[*&@!])[A-Za-z\d*&@!]{8,}$/.test(fields.password)) {
            errors.password = 'Password must be at least 8 characters long, include an uppercase letter, a digit, and one special character (*,&,@ or !).';
        }

        if (fields.password !== fields.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match.';
        }

        return errors;
    }

    /**
     * Validate login fields.
     * @param {Object} fields - The fields to validate.
     * @param {string} fields.email - The email address.
     * @param {string} fields.password - The password.
     * @returns {Object} - An object containing validation errors.
     */
    static validateLogin(fields) {
        const errors = {};

        if (!fields.email || !/\S+@\S+\.\S+/.test(fields.email)) {
            errors.email = 'Please provide a valid email.';
        }

        if (!fields.password) {
            errors.password = 'Password is required.';
        }



        return errors;
    }

    /**
     * Validate profile update fields.
     * @param {Object} fields - The fields to validate.
     * @param {string} fields.username - The username.
     * @param {string} fields.description - The profile description.
     * @param {string} fields.profile_picture - The profile picture URL.
     * @returns {Object} - An object containing validation errors.
     */
    static validateProfileUpdate(fields) {
        const errors = {};

        if (!fields.username || fields.username.length < 6) {
            errors.username = 'Username must be at least 6 characters long.';
        }

        if (!fields.description) {
            errors.description = 'Please provide a description.';
        }

        if (!fields.profile_picture) {
            errors.profile_picture = 'Please select a profile picture.';
        }

        return errors;
    }

    /**
     * Validate add song fields.
     * @param {Object} fields - The fields to validate.
     * @param {string} fields.title - The song title.
     * @param {string} fields.artist - The artist name.
     * @returns {Object} - An object containing validation errors.
     */
    static validateAddSong(fields) {
        const errors = {};

        if (!fields.title || fields.title.length < 3) {
            errors.title = 'Song title longer than 3 characters is required.';
        }

        if (!fields.artist || fields.artist.length < 3) {
            errors.artist = 'Artist name longer than 3 characters is required.';
        }

        if (!fields.genre || fields.genre.length < 1) {
            errors.genre = 'Genre name longer than 1 character is required.';
        }

        return errors;
    }

    /**
     * Validate create playlist fields.
     * @param {Object} fields - The fields to validate.
     * @param {string} fields.name - The playlist name.
     * @param {string} fields.description - The playlist description.
     * @returns {Object} - An object containing validation errors.
     */
    static validateCreatePlaylist(fields) {
       const errors = {};

        if (!fields.name) {
            errors.name = 'Playlist name is required.';
        }

        if (!fields.description) {
            errors.description = 'Playlist description is required.';
        }

        // Add more validations as needed
        return errors;
    }

    static validateEditPlaylist(fields) {
        const errors = {};

        if (!fields.name || fields.name.length < 3) {
            errors.name = 'Playlist name must be at least 3 characters long.';
        }

        if (!fields.description) {
            errors.description = 'Description is required.';
        }

        return errors;
    }
}
