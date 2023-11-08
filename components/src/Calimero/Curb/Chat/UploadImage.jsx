const ImageHolder = styled.div`
  maring-top: 1rem;
  margin-bottom: 1rem;
`;

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

return (
  <>
    {props.imageUp.cid && (
      <ImageHolder>
        <img
          src={`https://ipfs.near.social/ipfs/${props.imageUp.cid}`}
          alt="uploaded"
          style={{ maxHeight: "300px", maxWidth: "300px" }}
        />
      </ImageHolder>
    )}
    <div className="d-flex justify-center align-items-center">
      <div>{props.uploadComponent}</div>
      {props.imageUp.cid && (
        <RemoveBtn onClick={props.resetImage}>Remove</RemoveBtn>
      )}
    </div>
  </>
);
