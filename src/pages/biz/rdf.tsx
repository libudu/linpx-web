import { useEffect } from 'react';
import { history } from 'umi';
import { openInfoModal } from '../components/Modal';

export const useRDF = () => {
  // 红龙基金
  useEffect(() => {
    const initRDF =
      String(history.location.query?.from).toLocaleLowerCase() === 'rdf';
    if (initRDF) {
      openInfoModal({
        title: '红龙基金新人礼',
        children: (
          <div className="text-base">
            <div>礼品兑换码</div>
            <div>I8HLK-DQWR3-QJ404</div>
            <div>BQD0H-JBBCM-FALVH</div>
            <div>G69FV-WIIP7-EX9JQ</div>
          </div>
        ),
      });
    }
  }, []);
};
