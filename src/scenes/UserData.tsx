/* This is where the uibuilder action happens */
import React, {useState, useEffect} from 'react';
//import ReactDOM from 'react-dom';
//import { findDOMNode } from 'react-dom';

// @ts-ignore TODO proper typing
import uibuilder from 'node-red-contrib-uibuilder/front-end/src/uibuilderfe';

interface IUserDataProps {
    title?: string
}

function UserData(props: IUserDataProps) {

    // Example of retrieving data from uibuilder
    const [feVersion, setFeVersion] = useState<string>(uibuilder.get('version'));
    const [socketConnectedState, setSocketConnectedState] = useState<boolean>(false);
    const [serverTimeOffset, setServerTimeOffset] = useState<Object>(['unknown']);
    const [msgRecvd, setMsgRecvd] = useState<Object>(['Nothing']);
    const [msgsReceived, setMsgsReceived] = useState<number>(0);
    const [msgCtrl, setMsgCtrl] = useState<Object>(['Nothing']);
    const [msgsControl, setMsgsControl] = useState<number>(0);
    const [msgSent, setMsgSent] = useState<Object>(['Nothing']);
    const [msgsSent, setMsgsSent] = useState<number>(0);
    const [msgCtrlSent, setMsgCtrlSent] = useState<Object>(['Nothing']);
    const [msgsCtrlSent, setMsgsCtrlSent] = useState<number>(0);


    useEffect(
        () => {
            uibuilder.debug(true);

            /** **REQUIRED** Start uibuilder comms with Node-RED @since v2.0.0-dev3
             * Pass the namespace and ioPath variables if hosting page is not in the instance root folder
             * e.g. If you get continual `uibuilderfe:ioSetup: SOCKET CONNECT ERROR` error messages.
             * e.g. uibuilder.start('/nr/uib', '/nr/uibuilder/vendor/socket.io') // change to use your paths/names
             */
            uibuilder.start();


            /** You can use the following to help trace how messages flow back and forth.
             * You can then amend this processing to suite your requirements.
             */

            //#region ---- Trace Received Messages ---- //
            // If msg changes - msg is updated when a standard msg is received from Node-RED over Socket.IO
            // newVal relates to the attribute being listened to.
            uibuilder.onChange('msg', (newVal: Object) => {
                console.info('[uibuilder.onChange] msg received from Node-RED server:', newVal);
                setMsgRecvd(newVal);
            });

            // As we receive new messages, we get an updated count as well
            uibuilder.onChange('msgsReceived', (newVal: number) => {
                console.info('[uibuilder.onChange] Updated count of received msgs:', newVal);
                setMsgsReceived(newVal);
            });

            // If we receive a control message from Node-RED, we can get the new data here - we pass it to a Vue variable
            uibuilder.onChange('ctrlMsg', (newVal: Object) => {
                console.info('[uibuilder.onChange:ctrlMsg] CONTROL msg received from Node-RED server:', newVal);
                setMsgCtrl(newVal);
            });

            // Updated count of control messages received
            uibuilder.onChange('msgsCtrl', (newVal: number) => {
                console.info('[uibuilder.onChange:msgsCtrl] Updated count of received CONTROL msgs:', newVal);
                setMsgsControl(newVal);
            });

            //#endregion ---- End of Trace Received Messages ---- //

            //#region ---- Trace Sent Messages ---- //
            // You probably only need these to help you understand the order of processing //
            // If a message is sent back to Node-RED, we can grab a copy here if we want to
            uibuilder.onChange('sentMsg', (newVal: Object) => {
                console.info('[uibuilder.onChange:sentMsg] msg sent to Node-RED server:', newVal);
                setMsgSent(newVal);
            });

            // Updated count of sent messages
            uibuilder.onChange('msgsSent', (newVal: number) => {
                console.info('[uibuilder.onChange:msgsSent] Updated count of msgs sent:', newVal);
                setMsgsSent(newVal);
            });

            // If we send a control message to Node-RED, we can get a copy of it here
            uibuilder.onChange('sentCtrlMsg', (newVal: Object) => {
                console.info('[uibuilder.onChange:sentCtrlMsg] Control message sent to Node-RED server:', newVal);
                setMsgCtrlSent(newVal);
            });

            // And we can get an updated count
            uibuilder.onChange('msgsSentCtrl', (newVal: number) => {
                console.info('[uibuilder.onChange:msgsSentCtrl] Updated count of CONTROL msgs sent:', newVal);
                setMsgsCtrlSent(newVal);
            });

            //#endregion ---- End of Trace Sent Messages ---- //

            // If Socket.IO connects/disconnects, we get true/false here
            uibuilder.onChange('ioConnected', (newVal: boolean) => {
                console.info('[uibuilder.onChange:ioConnected] Socket.IO Connection Status Changed to:', newVal)
                setSocketConnectedState(newVal);
            });

            // If Server Time Offset changes
            uibuilder.onChange('serverTimeOffset', (newVal: Object) => {
                console.info('[uibuilder.onChange:serverTimeOffset] Offset of time between the browser and the server has changed to:', newVal)
                setServerTimeOffset(newVal);
            });

            //Manually send a message back to Node-RED after 2 seconds
            window.setTimeout(function () {
                console.info('Sending a message back to Node-RED-after2sdelay')
                uibuilder.send({'topic': 'uibuilderfe', 'payload': 'I am a message sent from the uibuilder front end'})
            }, 2000);


            return () => {
                uibuilder.clearEventListeners();
            };

        },
        []
    );


    return (

        <div style={{height: "50vh"}}>
            <hr></hr>
            <div className="d1">
                <div>Last msg Received:</div>
                <pre><code>{JSON.stringify(msgRecvd, null, 2)}</code></pre>
                <div># Msgs Received: {msgsReceived}</div>
            </div>

            <div className="d1">
                <div>last Ctl Msg Received:</div>
                <pre><code>{JSON.stringify(msgCtrl, null, 2)}</code></pre>
                <div># Control Msgs Received: {msgsControl}</div>
            </div>

            <div className="d1">
                <div>last Msg Sent</div>
                <pre><code>{JSON.stringify(msgSent, null, 2)}</code></pre>
                <div># msgs Sent: {msgsSent}</div>
            </div>

            <div className="d1">
                <div>Socket Connected?: {socketConnectedState}</div>
                <div>uibuilderfe Version: {feVersion}</div>
                <div>Server Time Offset from browser: {serverTimeOffset}</div>
            </div>

        </div>
    );

}

export default UserData
