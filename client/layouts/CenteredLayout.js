import React, { Component } from "react";
import Sidebar from "../containers/Sidebar";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

export default class extends Component {
    render() {
        const props = this.props.component.props;
        const settings = props.settings;
        return (
            <div className="main centered">
                <nav className="navbar navbar-default">
                    <div className="container">
                        <Navbar
                            settings={settings}
                            position="top"
                            router={{ ...this.props }}
                        />

                        <Footer data={settings.site_footer.value} />
                    </div>
                </nav>

                <main>{this.props.component}</main>
                <aside>
                    <Sidebar settings={settings} {...this.props} />
                </aside>
            </div>
        );
    }
}
