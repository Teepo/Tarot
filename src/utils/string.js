/**
 * @param {String} path
 *
 * @return {String}
 */
export function getFileNameAndExtension(path) {

    const segments = path.split('/');

    const fileNameWithExtension = segments[segments.length - 1];

    const fileNameSegments = fileNameWithExtension.split('.');
    const fileName = fileNameSegments[0];
    const fileExtension = fileNameSegments.length > 1 ? fileNameSegments[1] : '';

    return `${fileName}.${fileExtension}`;
};