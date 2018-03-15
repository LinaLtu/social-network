import React, { Component } from "react";
import axios from "./axios";

export default class ProfilePicUpload extends Component {
    constructor(props) {
        super(props);

        this.submitUploadImage = this.submitUploadImage.bind(this);
    }

    submitUploadImage(e) {
        console.log(e.target);
        e.preventDefault();
        let formData = new FormData();
        formData.append("file", e.target.files[0]);
        // axios post request to send the data along with it
        axios.post("/upload", formData).then(res => {
            this.props.changeImageUrl(res.data.data);
            //
            console.log(this.state);
        });
    }

    render() {
        return (
            <form>
                <input type="file" onChange={this.submitUploadImage} />
                {/*onChange*/}
            </form>
        );
    }
}
