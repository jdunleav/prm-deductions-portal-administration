import axios from 'axios';
import adapter from 'axios/lib/adapters/http';
import { message } from '../../src/api/health';
import config from '../../src/config';

describe('GET /health', () => {
  it('should return matching data', async () => {
    const res = await axios.get(`${config.url}/health`, {
      adapter
    });

    expect(res.data).toEqual(expect.objectContaining(message));
  });
});
