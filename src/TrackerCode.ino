/* FLORA+FONA GPS LOCATION */

//Libraries
#include <SoftwareSerial.h>
#include <Adafruit_SleepyDog.h>
#include <Adafruit_FONA.h>
#include <Adafruit_MQTT.h>
#include <Adafruit_MQTT_FONA.h>
#include <Adafruit_MQTT_Client.h>

//Declare Location Details
float initialLatitude;
float initialLongitude;
float latitude, longitude, speed_kph, heading, altitude;

//Pin Configurations
#define FONA_TX         9
#define FONA_RX         10
#define FONA_RST        6

//GPRS Configuration
#define FONA_APN          "internet.globe.com.ph"
#define FONA_USERNAME     ""
#define FONA_PASSWORD     ""

//Adafruit.io Configuration
#define AIO_SERVER        "io.adafruit.com"
#define AIO_SERVERPORT    1883
#define AIO_USERNAME      "jessiesalvador"
#define AIO_KEY           "b018410f9a0b4934abe1c0dd1089f3ea"

//Feeds
#define LOCATION_FEED_NAME    "location"
#define MAX_TX_FAILURES       3

//Instance & Configuration
SoftwareSerial fonaSS = SoftwareSerial(FONA_TX, FONA_RX);
SoftwareSerial *fonaSerial = &fonaSS;
Adafruit_FONA fona = Adafruit_FONA(FONA_RST);
const char MQTT_SERVER[] PROGMEM = AIO_SERVER;
const char MQTT_USERNAME[] PROGMEM = AIO_USERNAME;
const char MQTT_PASSWORD[] PROGMEM = AIO_KEY;

//FONA MQTT Setup
//Adafruit_MQTT_FONA mqtt(&fona, MQTT_SERVER, AIO_SERVERPORT, MQTT_USERNAME, MQTT_PASSWORD);
Adafruit_MQTT_FONA mqtt(&fona, AIO_SERVER, AIO_SERVERPORT, AIO_USERNAME, AIO_KEY);
uint8_t txFailures = 0;

//Feeds Configuration
//const char LOCATION_FEED[] PROGMEM = AIO_USERNAME "/feeds/" LOCATION_FEED_NAME "/csv";
//Adafruit_MQTT_Publish location_feed = Adafruit_MQTT_Publish(&mqtt, LOCATION_FEED);
Adafruit_MQTT_Publish location_feed = Adafruit_MQTT_Publish(&mqtt, AIO_USERNAME "/feeds/location/csv");

//const char BATTERY_FEED[] PROGMEM = AIO_USERNAME "/feeds/battery";
//Adafruit_MQTT_Publish battery_feed = Adafruit_MQTT_Publish(&mqtt, BATTERY_FEED);
Adafruit_MQTT_Publish battery_feed = Adafruit_MQTT_Publish(&mqtt, AIO_USERNAME "/feeds/battery");

void setup() {
  // Initialize Serial output
  Serial.begin(115200);
  Serial.println(F("Location Tracker with Adafruit IO, FONA 808, and FLORA"));

  
  //Initialize FONA
  Serial.println(F("Initializing FONA..."));
  fonaSS.begin(4800);

  if (!fona.begin(fonaSS)) {
    halt(F("FONA is not found!"));
  }

  fonaSS.println("AT+CMEE=2");
  Serial.println(F("FONA is OK!"));

  //Use watchdog
  Watchdog.enable(8000);
  Watchdog.reset();

  //Connect to Cellular Network
  Serial.println(F("Checking for cellular network..."));
  while (fona.getNetworkStatus() != 1) {
    delay(500);
  }

  //Enable GPS
  fona.enableGPS(true);

  //GPRS Connection
  Watchdog.reset();
  fona.setGPRSNetworkSettings(F(FONA_APN));
  delay(2000);
  Watchdog.reset();
  Serial.println(F("Disabling GPRS"));
  fona.enableGPRS(false);
  delay(2000);
  Watchdog.reset();
  Serial.println(F("Enabling GPRS"));
  if (!fona.enableGPRS(true)){
    halt(F("GPRS failed to turn on. Resetting the connection..."));
  }
  Serial.println(F("Connected to Cellular Data!"));

  //Wait to stabilize
  Watchdog.reset();
  delay(3000);

  //MQTT Connection
  int8_t ret = mqtt.connect();
  if (ret != 0){
    Serial.println(mqtt.connectErrorString(ret));
    halt(F("MQTT connection failed, resetting the connection..."));
  }
  Serial.println(F("MQTT connection successful!"));
  
  //Initial GPS read
  boolean gpsFix = fona.getGPS(&latitude, &longitude, &speed_kph, &heading, &altitude);
  initialLatitude = latitude;
  initialLongitude = longitude;

}

void loop() {
  
  // Watchdog reset at start of loop
  Watchdog.reset();
  
  //Reset Everything when too many failures
  if (!fona.TCPconnected() || (txFailures >= MAX_TX_FAILURES)){
    halt(F("Lost Connection, resetting the connection..."));
  }
  
  //Grab GPS Fix
  float latitude, longitude, speed_kph, speed_mph, heading, altitude;
  boolean gpsFix = fona.getGPS(&latitude, &longitude, &speed_kph, &heading, &altitude);

  /*if (gpsFix) {
    Serial.print("Latitude: ");
    Serial.println(latitude, 5);
    Serial.print("Initial Latitude: ");
    Serial.println(initialLatitude, 5);
    Serial.print("Longitude: ");
    Serial.println(longitude, 5);
    Serial.print("Initial Longitude: ");
    Serial.println(initialLongitude, 5);
    Serial.print("Speed KPH: ");
    Serial.println(speed_kph);
    Serial.print("Speed MPH: ");
    speed_mph = speed_kph  * 0.621371192;
    Serial.println(speed_mph);
    Serial.print("Heading: ");
    Serial.println(heading);
    Serial.print("Altitude: ");
    Serial.println(altitude);
  }
  else {
    Serial.println("Waiting for FONA GPS Fix");
  }*/
  Serial.print("Latitude: ");
  printFloat(latitude, 5);
  Serial.println("");

  Serial.print("Longitude: ");
  printFloat(longitude, 5);
  Serial.println("");

  Serial.print("Speed KPH: ");
  printFloat(speed_kph, 5);
  Serial.println("");

  Serial.print("Heading: ");
  printFloat(heading, 5);
  Serial.println("");

  Serial.print("Altitude: ");
  printFloat(altitude, 5);
  Serial.println("");
  
  //Grab Battery Reading
  uint16_t vbat;
  fona.getBattPercent(&vbat);

  //Log location & battery to the feed
  logLocation(latitude, longitude, altitude, location_feed);
  logBatteryPercent(vbat, battery_feed);
  
  //Wait for 5 seconds
  delay(5000);
  
  //Calculate distance between coordinates
  float distance = distanceCoordinates(latitude, longitude, initialLatitude, initialLongitude);

  Serial.print("Distance: ");
  printFloat(distance, 5);
  Serial.println("");
  
}

//Log Battery
void logBatteryPercent(uint32_t indicator, Adafruit_MQTT_Publish& publishFeed){
  Serial.print(F("Battery Percentage: "));
  Serial.println(indicator);
  if (!publishFeed.publish(indicator)){
    Serial.println(F("Publish failed"));
    txFailures++;
  }
  else {
    Serial.println(F("Publish Successful"));
    txFailures = 0;
  }
}

// Serialize the lat, long, altitude to a CSV string that can be published to the specified feed.
void logLocation(float latitude, float longitude, float altitude, Adafruit_MQTT_Publish& publishFeed) {
  // Initialize a string buffer to hold the data that will be published.
  
  char sendBuffer[120];
  memset(sendBuffer, 1, sizeof(sendBuffer));
  int index = 0;

  // Start with '0,' to set the feed value. 
  sendBuffer[index++] = '0';
  sendBuffer[index++] = ',';

  // Now set latitude, longitude, altitude separated by commas.
  dtostrf(latitude, 2, 6, &sendBuffer[index]);
  index += strlen(&sendBuffer[index]);
  sendBuffer[index++] = ',';
  
  dtostrf(longitude, 3, 6, &sendBuffer[index]);
  index += strlen(&sendBuffer[index]);
  sendBuffer[index++] = ',';
  
  dtostrf(altitude, 2, 6, &sendBuffer[index]);

  // Finally publish the string to the feed.
  Serial.print(F("Publishing location: "));
  Serial.println(sendBuffer);
  if (!publishFeed.publish(sendBuffer)) {
    Serial.println(F("Publish failed!"));
    txFailures++;
  }
  else {
    Serial.println(F("Publish succeeded!"));
    txFailures = 0;
  }
}

// Halt function called when an error occurs.  Will print an error and stop execution while
// doing a fast blink of the LED.  If the watchdog is enabled it will reset after 8 seconds.
void halt(const __FlashStringHelper *error) {
  Serial.println(error);
 
}

//Set MQTT connection
void MQTT_connect() {
  int8_t ret;

  // Stop if already connected.
  if (mqtt.connected()) {
    return;
  }

  Serial.print("Connecting to MQTT... ");

  while ((ret = mqtt.connect()) != 0) { // connect will return 0 for connected
    Serial.println(mqtt.connectErrorString(ret));
    Serial.println("Retrying MQTT connection in 5 seconds...");
    mqtt.disconnect();
    delay(5000);  // wait 5 seconds
  }
  Serial.println("MQTT Connected!");
}

void printFloat(float value, int places) {
  // this is used to cast digits 
  int digit;
  float tens = 0.1;
  int tenscount = 0;
  int i;
  float tempfloat = value;

    // make sure we round properly. this could use pow from <math.h>, but doesn't seem worth the import
  // if this rounding step isn't here, the value  54.321 prints as 54.3209

  // calculate rounding term d:   0.5/pow(10,places)  
  float d = 0.5;
  if (value < 0)
    d *= -1.0;
  // divide by ten for each decimal place
  for (i = 0; i < places; i++)
    d/= 10.0;    
  // this small addition, combined with truncation will round our values properly 
  tempfloat +=  d;

  // first get value tens to be the large power of ten less than value
  // tenscount isn't necessary but it would be useful if you wanted to know after this how many chars the number will take

  if (value < 0)
    tempfloat *= -1.0;
  while ((tens * 10.0) <= tempfloat) {
    tens *= 10.0;
    tenscount += 1;
  }


  // write out the negative if needed
  if (value < 0)
    Serial.print('-');

  if (tenscount == 0)
    Serial.print(0, DEC);

  for (i=0; i< tenscount; i++) {
    digit = (int) (tempfloat/tens);
    Serial.print(digit, DEC);
    tempfloat = tempfloat - ((float)digit * tens);
    tens /= 10.0;
  }

  // if no places after decimal, stop now and return
  if (places <= 0)
    return;

  // otherwise, write the point and continue on
  Serial.print('.');  

  // now write out each decimal place by shifting digits one by one into the ones place and writing the truncated value
  for (i = 0; i < places; i++) {
    tempfloat *= 10.0; 
    digit = (int) tempfloat;
    Serial.print(digit,DEC);  
    // once written, subtract off that digit
    tempfloat = tempfloat - (float) digit; 
  }
}

// Calculate distance between two points
float distanceCoordinates(float flat1, float flon1, float flat2, float flon2) {

  // Variables
  float dist_calc=0;
  float dist_calc2=0;
  float diflat=0;
  float diflon=0;

  // Calculations
  diflat  = radians(flat2-flat1);
  flat1 = radians(flat1);
  flat2 = radians(flat2);
  diflon = radians((flon2)-(flon1));

  dist_calc = (sin(diflat/2.0)*sin(diflat/2.0));
  dist_calc2 = cos(flat1);
  dist_calc2*=cos(flat2);
  dist_calc2*=sin(diflon/2.0);
  dist_calc2*=sin(diflon/2.0);
  dist_calc +=dist_calc2;

  dist_calc=(2*atan2(sqrt(dist_calc),sqrt(1.0-dist_calc)));
  
  dist_calc*=6371000.0; //Converting to meters

  return dist_calc;
}
