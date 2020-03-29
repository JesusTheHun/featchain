import React from "react";
import {getPath} from "../utils/router-paths";
import QRCode from "qrcode.react";
import {Button} from "antd";
import {DownloadOutlined} from "@ant-design/icons/lib";

type State = {
};

type Props = {
    address: string;
};

export class QRCodeModal extends React.Component<Props, State> {

    download = () => {
        const canvas = document.getElementsByTagName('canvas').item(0);

        if (canvas) {
            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/jpg');
            link.download = "featchain-verification-qrcode";
            link.click();
        }
    };

    render() {
        return <div className="uk-text-center">
            <QRCode value={getPath('verifyAccount', this.props.address)} size={256}/>
            <div className="uk-margin-medium-top">
                <Button type='primary' icon={<DownloadOutlined />} onClick={this.download}>Download</Button>
            </div>
        </div>;
    }
}

export default QRCodeModal;
