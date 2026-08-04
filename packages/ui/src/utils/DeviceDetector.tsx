import Bowser from 'bowser';

export interface DeviceInfo {
  browser: {
    name: string | undefined;
    version: string | undefined;
  };
  os: {
    name: string | undefined;
    version: string | undefined;
    versionName: string | undefined;
  };
  platform: {
    type: string | undefined; // 'desktop' | 'mobile' | 'tablet'
    vendor: string | undefined;
    model: string | undefined;
  };
  engine: {
    name: string | undefined;
    version: string | undefined;
  };
  is: {
    mobile: boolean;
    tablet: boolean;
    desktop: boolean;
    ios: boolean;
    android: boolean;
    windows: boolean;
    mac: boolean;
    linux: boolean;
    chrome: boolean;
    firefox: boolean;
    safari: boolean;
    edge: boolean;
  };
}

export const getDeviceInfo = (userAgent?: string): DeviceInfo | null => {
  // userAgent is required — bowser needs it
  const ua =
    userAgent ??
    (typeof window !== 'undefined' ? window.navigator.userAgent : null);

  if (!ua) return null;

  const parser = Bowser.getParser(ua);
  const result = parser.getResult();

  return {
    browser: {
      name: result.browser.name,
      version: result.browser.version
    },
    os: {
      name: result.os.name,
      version: result.os.version,
      versionName: result.os.versionName
    },
    platform: {
      type: result.platform.type,
      vendor: result.platform.vendor,
      model: result.platform.model
    },
    engine: {
      name: result.engine.name,
      version: result.engine.version
    },
    is: {
      mobile: parser.isPlatform('mobile'),
      tablet: parser.isPlatform('tablet'),
      desktop: parser.isPlatform('desktop'),
      ios: parser.isOS('iOS'),
      android: parser.isOS('Android'),
      windows: parser.isOS('Windows'),
      mac: parser.isOS('macOS'),
      linux: parser.isOS('Linux'),
      chrome: parser.isBrowser('Chrome'),
      firefox: parser.isBrowser('Firefox'),
      safari: parser.isBrowser('Safari'),
      edge: parser.isBrowser('Microsoft Edge')
    }
  };
};
