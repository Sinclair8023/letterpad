import React, { Component } from "react";
import { gql, graphql, compose } from "react-apollo";
import PostActions from "../../components/posts/PostActions";
import RaisedButton from "material-ui/RaisedButton";

class FeaturedImage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cover_image: this.props.post.cover_image
        };
        this.removeImage = this.removeImage.bind(this);
    }

    async uploadImage(files) {
        const coverImage = await PostActions.uploadFile(
            files,
            this.props.insertMedia
        );

        this.props.updateFeaturedImage({
            id: this.props.post.id,
            cover_image: coverImage
        });
        this.setState({ cover_image: coverImage });
    }
    removeImage(e) {
        e.preventDefault();
        this.props.updateFeaturedImage({
            id: this.props.post.id,
            cover_image: ""
        });
        this.setState({ cover_image: "" });
    }

    render() {
        const coverImage =
            this.state.cover_image || "http://placehold.it/800x300";
        return (
            <div className="featured-image">
                <div>
                    <img alt="" width="100%" src={coverImage} />
                </div>
                {(() => {
                    if (!this.state.cover_image) {
                        return (
                            <RaisedButton
                                label="Choose an Image"
                                labelPosition="before"
                                containerElement="label"
                                primary={true}
                            >
                                <input
                                    ref="uploadInput"
                                    onChange={input =>
                                        this.uploadImage(input.target.files)
                                    }
                                    type="file"
                                    className="hide"
                                    name="uploads[]"
                                    multiple="multiple"
                                />
                            </RaisedButton>
                        );
                    }
                    return (
                        <RaisedButton
                            label="Remove Featured Image"
                            labelPosition="before"
                            primary={true}
                            onClick={this.removeImage}
                            containerElement="label"
                        />
                    );
                })()}
            </div>
        );
    }
}

const uploadCoverImageQuery = gql`
    mutation uploadFile($cover_image: String!, $id: Int!) {
        uploadFile(cover_image: $cover_image, id: $id) {
            ok
            post {
                id
                cover_image
            }
        }
    }
`;

const updateQueryWithData = graphql(uploadCoverImageQuery, {
    props: ({ mutate }) => ({
        updateFeaturedImage: data =>
            mutate({
                variables: data,
                updateQueries: {
                    getPost: (prev, { mutationResult }) => {
                        const coverImage = mutationResult.data.uploadFile
                            ? mutationResult.data.uploadFile.post.cover_image
                            : "";
                        return {
                            post: {
                                ...prev.post,
                                cover_image: coverImage
                            }
                        };
                    }
                }
            })
    })
});

const insertMediaQuery = gql`
    mutation insertMedia($url: String!) {
        insertMedia(url: $url) {
            url
        }
    }
`;
const insertMedia = graphql(insertMediaQuery, {
    props: ({ mutate }) => ({
        insertMedia: data => {
            mutate({
                variables: data
            });
        }
    })
});

const Data = compose(updateQueryWithData, insertMedia);
export default Data(FeaturedImage);
