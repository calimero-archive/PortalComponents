const RemoveBtn = styled.div`
  color: #dc3545;
  :hover {
    color: #f76560;
  }
  font-family: Helvetica Neue;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%;
  cursor: pointer;
  padding-left: 1rem;
`;

const FileUrl = styled.a`
  cursor: pointer;
  text-decoration: none;
  color: #ffdd1d;
  cursor: pointer;
  :hover {
    color: #ffdd1d;
    text-decoration: underline;
  }
  :visited {
    color: #d0fc42;
  }
`;

const uploadFileUpdateState = (body) => {
  asyncFetch("https://ipfs.near.social/add", {
    method: "POST",
    headers: { Accept: "application/json" },
    body,
  }).then((res) => {
    const cid = res.body.cid;
    props.setUploadedFile({ file: { cid, name: body.name } });
  });
};

const filesOnChange = (files) => {
  if (files) {
    props.setUploadedFile({ file: { uploading: true, cid: null } });
    uploadFileUpdateState(files[0]);
  }
};

return (
  <>
    {props.uploadedFile.file && (
      <>
        <i className="bi bi-file-earmark-arrow-down-fill text-light"></i>
        <FileUrl
          href={`https://ipfs.near.social/ipfs/${props.uploadedFile.file.cid}`}
          target="_blank"
        >
          {props.uploadedFile.file.name}
        </FileUrl>
      </>
    )}
    <div className="d-flex justify-center align-items-center mt-2">
      <Files
        multiple={false}
        accepts={["*/*"]}
        minFileSize={1}
        clickable
        className="btn btn-secondary w-100"
        onChange={filesOnChange}
      >
        {props.uploadedFile.file?.uploading ? "Uploading" : "Upload a File"}
      </Files>
      {props.uploadedFile.file && (
        <RemoveBtn onClick={props.resetFile}>Remove</RemoveBtn>
      )}
    </div>
  </>
);
