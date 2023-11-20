import React, { FC, useState, ReactNode, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { ConfigContext } from '../../component/config/index';
import './style/style.scss';
import Icon from '../../component/icon';
import Avatar from '../../component/avatar';
import Badge from '../../component/badge';
import { string } from 'prop-types';
import { Sticky } from 'react-sticky';
export interface ContactGroupProps {
  prefix?: string;
  children?: ReactNode;
  title?: string;
  itemCount?: number;
  itemHeight?: number;
  open?: boolean;
  onclickTitle?: (data: any) => void;
}

const ContactGroup: FC<ContactGroupProps> = props => {
  const {
    prefix: customizePrefixCls,
    children,
    title,
    itemCount,
    open = false,
    onclickTitle,
  } = props;
  const { getPrefixCls } = React.useContext(ConfigContext);
  const prefixCls = getPrefixCls('contactGroup', customizePrefixCls);

  const groupClass = classNames(prefixCls);

  const [childrenVisible, setChildrenVisible] = useState(false);
  const [iconType, setIconType] = useState(0);
  const [height, setHeight] = useState<number | string>(0);
  const handleClickTitle = (title?: string) => {
    setChildrenVisible(childrenVisible => !childrenVisible);
    setIconType(type => (type == 0 ? 90 : 0));
    onclickTitle?.(title);
    setHeight(childrenVisible ? 0 : `${panelRef?.current?.scrollHeight}px`);
  };

  const childrenClass = classNames(`${groupClass}-children`, {
    [`${groupClass}-children-show`]: childrenVisible,
    [`${groupClass}-children-hide`]: !childrenVisible,
  });

  const panelRef = useRef<HTMLDivElement>(null);
  return (
    <div className={groupClass}>
      <div className={`${groupClass}-title`} onClick={() => handleClickTitle(title)}>
        <div> {title}</div>
        <div>
          <span>{itemCount}</span>
          <div className={`${groupClass}-icon`} style={{ transform: `rotate(${iconType}deg)` }}>
            <Icon type="ARROW_RIGHT"></Icon>
          </div>
        </div>
      </div>

      <div
        className={childrenClass}
        ref={panelRef}
        style={{
          height: height,
        }}
      >
        {children}
      </div>
    </div>
  );
};

export { ContactGroup };
