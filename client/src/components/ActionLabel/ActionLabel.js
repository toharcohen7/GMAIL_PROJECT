function ActionLabel({ labelName, badgeCount = 0 }) {
  return (
    <button className="user-label-actions">
        <span className="badge badge-label text-bg">{badgeCount}</span>
        <span className="action-btn btn btn-sm rounded-circle" title={labelName}>
            <i className="bi bi-three-dots-vertical fw-bold"></i>
        </span>
    </button>
  );
}
export default ActionLabel;