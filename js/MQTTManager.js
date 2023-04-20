/**
 * Handles the MQTT logic like connection and subscription
 */
 class MQTTManager {
    /*
        source: https://www.eclipse.org/paho/index.php?page=clients/js/index.php
        test broker: http://www.hivemq.com/demos/websocket-client/;
    */
    host;
    port;
    mqtt;

    /**
     * Creates and initializes an MQTTManager with host and port.
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
        console.log(`Connected to broker at: ${this.host}:${this.port}`);
    }
    
    /**
     * Triggers a console log on connection failure to the broker
     */
    onFailure() {
        console.log(`No broker at: ${this.host}:${this.port}`);
    }
    
    /**
     * Subscribe to the broker
     */
    subscribe(topic) {
        this.mqtt.subscribe(topic);
        console.log(`subscribed to topic ${topic}`);
    }

    /**
     * Triggers when the broker publishes a message and saves it
     * @param {*} message The published message from the broker
     */
    onMessageArrived(message) {
        console.log(`recieved on topic "${message.destinationName}": "${message.payloadString}"`);
        handleMessageArrived(message);
    }

    /**
     * Publish a message to the broker.
     * @param {string} message The message that gets published to the broker
     */
    publish(message, topic) {
        let mqttMessage = new Paho.MQTT.Message(message);
        mqttMessage.destinationName = topic;
        this.mqtt.send(mqttMessage);
        
        console.log(`published on topic "${topic}": "${message}"`);
    }
}