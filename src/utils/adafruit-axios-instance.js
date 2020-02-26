import axios from 'axios';

const baseURL = 'https://io.adafruit.com/api/v2/jessiesalvador/';

const instance = axios.create({
  baseURL: baseURL,
});

instance.defaults.headers.common['X-AIO-Key'] =
  'b018410f9a0b4934abe1c0dd1089f3ea';
instance.defaults.headers.post['Content-Type'] =
  'application/x-www-form-urlencoded';
instance.defaults.headers.put['Content-Type'] =
  'application/x-www-form-urlencoded';

export default instance;
