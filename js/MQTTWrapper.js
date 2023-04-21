/**
 * Handles the MQTT logic like connection and subscription
 */
class MQTTWrapper {
    /*
        source: https://www.eclipse.org/paho/index.php?page=clients/js/index.php
        public test broker: test.mosquitto.org; port defines connection
    */
    host;
    port;
    mqtt;
    debug = false;

    /**
     * Creates and initializes an MQTTWrapper with host and port.
     */
    constructor(host, port) {
        this.host = host;
        this.port = port;
    }

    /**
     * Connects to the broker at the given ip address.
     */
    connect() {
        // initialize broker connection
        this.mqtt = new Paho.MQTT.Client(this.host, this.port, "");
        this.mqtt.onMessageArrived = this.onMessageArrived.bind(this);

        var options = {
            timeout: 3,
            onSuccess: this.onConnect.bind(this),
            onFailure: this.onFailure.bind(this),
            useSSL: true
        };
        this.mqtt.connect(options);
    }
    
    /**
     * Triggers a console log on connection success to the broker & subscribes to the broker at the given topic
     */
    onConnect() {
        if (this.debug) console.log(`Connected to broker at: ${this.host}:${this.port}`);
    }
    
    /**
     * Triggers a console log on connection failure to the broker
     */
    onFailure() {
        if (this.debug) console.log(`No broker at: ${this.host}:${this.port}`);
    }
    
    /**
     * Subscribe to the broker
     */
    subscribe(topic) {
        this.mqtt.subscribe(topic);
        if (this.debug) console.log(`subscribed to topic ${topic}`);
    }


    unsubscribe(topic) {
        this.mqtt.unsubscribe(topic);
        if (this.debug) console.log(`unsubscribed from topic ${topic}`);
    }

    /**
     * Triggers when the broker publishes a message and saves it
     * @param {*} message The published message from the broker
     */
    onMessageArrived(message) {
        if (this.debug) console.log(`recieved on topic "${message.destinationName}": "${message.payloadString}"`);
        this.onMessage(message);
    }

    /**
     * Publish a message to the broker.
     * @param {string} message The message that gets published to the broker
     */
    publish(message, topic) {
        let mqttMessage = new Paho.MQTT.Message(message);
        mqttMessage.destinationName = topic;
        this.mqtt.send(mqttMessage);
        
        if (this.debug) console.log(`published on topic "${topic}": "${message}"`);
    }
}