import request from 'supertest';
import app from '../../app';

// In all other unit tests we want to pass through all of this logic and should therefore call jest.mock
// jest.mock('../auth') will call the manual mock in __mocks__ automatically
describe('auth', () => {
  beforeEach(() => {
    process.env.AUTHORIZATION_KEYS = 'correct-key,other-key';
  });

  afterEach(() => {
    if (process.env.AUTHORIZATION_KEYS) {
      delete process.env.AUTHORIZATION_KEYS;
    }
  });

  describe('authenticated successfully', () => {
    it('should return HTTP 200 when correctly authenticated', done => {
      request(app)
        .get('/example-authenticated')
        .set('Authorization', 'correct-key')
        .expect(200)
        .end(done);
    });
  });

  describe('AUTHORIZATION_KEYS environment variables not provides', () => {
    beforeEach(() => {
      if (process.env.AUTHORIZATION_KEYS) {
        delete process.env.AUTHORIZATION_KEYS;
      }
    });

    it('should return 412 if AUTHORIZATION_KEYS have not been set', done => {
      request(app)
        .get('/example-authenticated')
        .set('Authorization', 'correct-key')
        .expect(412)
        .end(done);
    });

    it('should return an explicit error message in the body if AUTHORIZATION_KEYS have not been set', done => {
      request(app)
        .get('/example-authenticated')
        .set('Authorization', 'correct-key')
        .expect(res => {
          expect(res.body).toEqual(
            expect.objectContaining({
              error: 'Server-side Authorization keys have not been set, cannot authenticate'
            })
          );
        })
        .end(done);
    });
  });

  describe('Authorization header not provided', () => {
    it('should return HTTP 401 when no authorization header provided', done => {
      request(app)
        .get('/example-authenticated')
        .expect(401)
        .end(done);
    });

    it('should return an explicit error message in the body when no authorization header provided', done => {
      request(app)
        .get('/example-authenticated')
        .expect(res => {
          expect(res.body).toEqual(
            expect.objectContaining({
              error:
                'The request (/example-authenticated) requires a valid Authorization header to be set'
            })
          );
        })
        .end(done);
    });
  });

  describe('incorrect Authorisation header value provided ', () => {
    it('should return HTTP 403 when authorization key is incorrect', done => {
      request(app)
        .get('/example-authenticated')
        .set('Authorization', 'incorrect-key')
        .expect(403)
        .end(done);
    });

    it('should return an explicit error message in the body when authorization key is incorrect', done => {
      request(app)
        .get('/example-authenticated')
        .set('Authorization', 'incorrect-key')
        .expect(res => {
          expect(res.body).toEqual(
            expect.objectContaining({
              error: 'Authorization header is provided but not valid'
            })
          );
        })
        .end(done);
    });
  });
});
