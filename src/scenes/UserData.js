/* This is where the uibuilder action happens */
import React, { Component } from 'react';
//import ReactDOM from 'react-dom';
//import { findDOMNode } from 'react-dom';

import uibuilder from '../libs/uibuilderfe.js'

class UserData extends Component{
	constructor(props){
		super(props)

        /** **REQUIRED** Start uibuilder comms with Node-RED @since v2.0.0-dev3
         * Pass the namespace and ioPath variables if hosting page is not in the instance root folder
         * e.g. If you get continual `uibuilderfe:ioSetup: SOCKET CONNECT ERROR` error messages.
         * e.g. uibuilder.start('/nr/uib', '/nr/uibuilder/vendor/socket.io') // change to use your paths/names
         */
        uibuilder.start();

		this.state = {
            // Example of retrieving data from uibuilder
            feVersion   : uibuilder.get('version'),

            socketConnectedState : false,
            serverTimeOffset     : '[unknown]',

            msgRecvd    : '[Nothing]',
            msgsReceived: 0,
            msgCtrl     : '[Nothing]',
            msgsControl : 0,

            msgSent     : '[Nothing]',
            msgsSent    : 0,
            msgCtrlSent : '[Nothing]',
            msgsCtrlSent: 0,
        }

        /** You can use the following to help trace how messages flow back and forth.
         * You can then amend this processing to suite your requirements.
         */

        //#region ---- Trace Received Messages ---- //
        // If msg changes - msg is updated when a standard msg is received from Node-RED over Socket.IO
        // newVal relates to the attribute being listened to.
		uibuilder.onChange('msg', (newVal) => {

			this.setState({ 'msgRecvd': newVal });

			console.info('[uibuilder.onChange] msg received from Node-RED server:', newVal);
		})

        // As we receive new messages, we get an updated count as well
		uibuilder.onChange('msgsReceived',(newVal) =>{
            console.info('[uibuilder.onChange] Updated count of received msgs:', newVal);

			this.setState({ 'msgsReceived': newVal });
		})

        // If we receive a control message from Node-RED, we can get the new data here - we pass it to a Vue variable
        uibuilder.onChange('ctrlMsg', (newVal) => {
            console.info('[uibuilder.onChange:ctrlMsg] CONTROL msg received from Node-RED server:', newVal);

            this.setState({ 'msgCtrl': newVal });
        })
        // Updated count of control messages received
        uibuilder.onChange('msgsCtrl', (newVal) => {
            console.info('[uibuilder.onChange:msgsCtrl] Updated count of received CONTROL msgs:', newVal);

            this.setState({ 'msgsControl': newVal });
        })
        //#endregion ---- End of Trace Received Messages ---- //

        //#region ---- Trace Sent Messages ---- //
        // You probably only need these to help you understand the order of processing //
        // If a message is sent back to Node-RED, we can grab a copy here if we want to
        uibuilder.onChange('sentMsg', (newVal) => {
            console.info('[uibuilder.onChange:sentMsg] msg sent to Node-RED server:', newVal);

            this.setState({ 'msgSent': newVal });
        })
        // Updated count of sent messages
        uibuilder.onChange('msgsSent', (newVal) => {
            console.info('[uibuilder.onChange:msgsSent] Updated count of msgs sent:', newVal);

            this.setState({ 'msgsSent': newVal });
        })

        // If we send a control message to Node-RED, we can get a copy of it here
        uibuilder.onChange('sentCtrlMsg', (newVal) => {
            console.info('[uibuilder.onChange:sentCtrlMsg] Control message sent to Node-RED server:', newVal);

            this.setState({ 'msgCtrlSent': newVal });
        })
        // And we can get an updated count
        uibuilder.onChange('msgsSentCtrl', (newVal) => {
            console.info('[uibuilder.onChange:msgsSentCtrl] Updated count of CONTROL msgs sent:', newVal);

            this.setState({ 'msgsCtrlSent': newVal });
        })
        //#endregion ---- End of Trace Sent Messages ---- //

        // If Socket.IO connects/disconnects, we get true/false here
        uibuilder.onChange('ioConnected', (newVal) => {
            console.info('[uibuilder.onChange:ioConnected] Socket.IO Connection Status Changed to:', newVal)

            this.setState({ 'socketConnectedState': newVal })
        })
        // If Server Time Offset changes
        uibuilder.onChange('serverTimeOffset', (newVal) =>{
            console.info('[uibuilder.onChange:serverTimeOffset] Offset of time between the browser and the server has changed to:', newVal)

            this.setState({ 'serverTimeOffset': newVal })
        })

        	//Manually send a message back to Node-RED after 2 seconds
        	window.setTimeout(function(){
        	    console.info('Sending a message back to Node-RED-after2sdelay')
        	    uibuilder.send({'topic':'uibuilderfe','payload':'I am a message sent from the uibuilder front end'})
        	},2000)
	}


	render(){
		return(

			<div ref="root" style={{height:"50vh"}}>
                <hr></hr>
                <div className="d1">
                    <div>Last msg Received:</div>
                    <pre><code>{JSON.stringify(this.state.msgRecvd, null, 2)}</code></pre>
                    <div># Msgs Received: {this.state.msgsReceived}</div>
                </div>

                <div className="d1">
                    <div>last Ctl Msg Received:</div>
                    <pre><code>{JSON.stringify(this.state.msgCtrl, null, 2)}</code></pre>
                    <div># Control Msgs Received: {this.state.msgsControl}</div>
                </div>

                <div className="d1">
                    <div>last Msg Sent</div>
                    <pre><code>{JSON.stringify(this.state.msgSent, null, 2)}</code></pre>
                    <div># msgs Sent: {this.state.msgsSent}</div>
                </div>

                <div className="d1">
                    <div>Socket Connected?: {this.state.socketConnectedState}</div>
                    <div>uibuilderfe Version: {this.state.feVersion}</div>
                    <div>Server Time Offset from browser: {this.state.serverTimeOffset}</div>
                </div>

			</div>
		);

	}

}

export default UserData
