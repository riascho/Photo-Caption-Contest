/**
 * @swagger
 * /api/images:
 *   get:
 *     summary: Retrieve all images with their captions
 *     description: Returns a list of all images in the database, including associated captions and user information for each caption. This endpoint is publicly accessible and does not require authentication.
 *     tags: [Images]
 *     responses:
 *       200:
 *         description: A list of images with captions successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Image'
 *             example:
 *               - id: 1
 *                 url: "/images/photo1.jpg"
 *                 captions:
 *                   - id: 1
 *                     text: "When you realize it's Monday tomorrow"
 *                     user:
 *                       id: 1
 *                       userName: "john_doe"
 *                   - id: 2
 *                     text: "Me trying to adult"
 *                     user:
 *                       id: 2
 *                       userName: "jane_smith"
 *       500:
 *         description: Server error while fetching images
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Failed to fetch images"
 */

/**
 * @swagger
 * /api/images/{id}:
 *   get:
 *     summary: Retrieve a specific image by ID
 *     description: Returns a single image with its associated captions and user information. Use this endpoint to get detailed information about a specific image.
 *     tags: [Images]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The unique identifier of the image
 *         example: 1
 *     responses:
 *       200:
 *         description: Image found and returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Image'
 *             example:
 *               id: 1
 *               url: "/images/photo1.jpg"
 *               captions:
 *                 - id: 1
 *                   text: "When you realize it's Monday tomorrow"
 *                   user:
 *                     id: 1
 *                     userName: "john_doe"
 *                 - id: 2
 *                   text: "Me trying to adult"
 *                   user:
 *                     id: 2
 *                     userName: "jane_smith"
 *       404:
 *         description: Image not found with the provided ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Image not found"
 *       500:
 *         description: Server error while fetching the image
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Failed to fetch image"
 */

/**
 * @swagger
 * /api/images/{id}/captions:
 *   post:
 *     summary: Add a caption to a specific image
 *     description: Creates a new caption for the specified image. This endpoint requires authentication - users must be logged in to submit captions. The caption will be associated with the authenticated user.
 *     tags: [Captions]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The unique identifier of the image to caption
 *         example: 1
 *     requestBody:
 *       required: true
 *       description: The caption text to submit for the image
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CaptionInput'
 *           example:
 *             text: "When you realize it's Monday tomorrow"
 *     responses:
 *       201:
 *         description: Caption created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Caption'
 *             example:
 *               id: 1
 *               text: "When you realize it's Monday tomorrow"
 *               user:
 *                 id: 1
 *                 userName: "john_doe"
 *               image:
 *                 id: 1
 *                 url: "/images/photo1.jpg"
 *       400:
 *         description: Bad request - caption text is missing or invalid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Caption text is required"
 *       401:
 *         description: Unauthorized - user is not logged in
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Unauthorized - please log in"
 *       404:
 *         description: Image or user not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               imageNotFound:
 *                 value:
 *                   error: "Image not found"
 *               userNotFound:
 *                 value:
 *                   error: "User not found"
 *       500:
 *         description: Server error while creating the caption
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Failed to create caption"
 */

