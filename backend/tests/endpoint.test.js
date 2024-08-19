const metadata_fetching = require('./fetch_logic/main');
const mockMetadata = [{ title: 'Test Title', description: 'Test Description', image: 'test.jpg' }];

jest.mock('./fetch_logic/main', () => jest.fn(() => Promise.resolve(mockMetadata)));


// to test the post endpont with valid data
describe('POST /api/fetch', () => {
    it('should return metadata for valid URLs', async () => {
        const response = await request(app)
            .post('/api/fetch')
            .send({ data: { items: ['https://www.kley-zemer.co.il/'] } })
            .set('X-CSRF-Token', 'valid-csrf-token'); // Use a valid CSRF token here
        expect(response.status).toBe(200);
        expect(response.body.data).toEqual(mockMetadata);
    });
});