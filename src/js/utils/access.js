export default function access(session, prevs) {
    if (session.prevs && prevs.length) {
        for (let i = 0; i < prevs.length; i++) {
            if (session.prevs.indexOf(prevs[i]) === -1) {
                return false;
            }
        }
    }
    return true;
}
