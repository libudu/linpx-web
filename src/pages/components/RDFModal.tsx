import { history } from 'umi';
import { Modal } from 'antd-mobile';
import { useState } from 'react';

const initRDF =
  String(history.location.query?.from).toLocaleLowerCase() === 'rdf';

export default function RDFModal() {
  const [showRDF, setShowRDF] = useState(initRDF);
  return (
    <Modal
      visible={showRDF}
      transparent
      maskClosable={false}
      title="红龙基金新人礼"
      footer={[{ text: '确认', onPress: () => setShowRDF(false) }]}
    >
      <div className="text-base">
        <div>礼品兑换码</div>
        <div>I8HLK-DQWR3-QJ404</div>
        <div>BQD0H-JBBCM-FALVH</div>
        <div>G69FV-WIIP7-EX9JQ</div>
      </div>
    </Modal>
  );
}
