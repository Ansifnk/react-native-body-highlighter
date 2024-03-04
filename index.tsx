import React, {memo, useCallback} from 'react';
import {Path, G, Circle} from 'react-native-svg';
import differenceWith from 'ramda/src/differenceWith';

import {bodyFront} from './assets/bodyFront';
import {bodyBack} from './assets/bodyBack';
import {SvgMaleWrapper} from './components/SvgMaleWrapper';
import {bodyFemaleFront} from './assets/bodyFemaleFront';
import {bodyFemaleBack} from './assets/bodyFemaleBack';
import {SvgFemaleWrapper} from './components/SvgFemaleWrapper';
import PathWithCenter from 'react-native-body-highlighter/components/PathWithCenter';

export type Slug =
  | 'abs'
  | 'adductors'
  | 'ankles'
  | 'biceps'
  | 'calves'
  | 'chest'
  | 'deltoids'
  | 'deltoids'
  | 'feet'
  | 'forearm'
  | 'gluteal'
  | 'hamstring'
  | 'hands'
  | 'hair'
  | 'head'
  | 'knees'
  | 'lower-back'
  | 'neck'
  | 'obliques'
  | 'quadriceps'
  | 'tibialis'
  | 'trapezius'
  | 'triceps'
  | 'upper-back'
  | 'knee'
  | 'elbow'
  | 'hip'
  | 'clavicle'
  | 'wrist'
  | 'angle';

export interface BodyPart {
  intensity?: number;
  color: string;
  slug: Slug;
  pathArray?: string[];
  type?: string;
  cx?: string;
  cy?: string;
}

type Props = {
  colors: ReadonlyArray<string>;
  data: ReadonlyArray<BodyPart>;
  scale: number;
  frontOnly: boolean;
  backOnly: boolean;
  side: 'front' | 'back';
  gender?: 'male' | 'female';
  onBodyPartPress: (b: BodyPart) => void;
  renderCircles: any;
};

const comparison = (a: BodyPart, b: BodyPart) => a.slug === b.slug;

const Body = ({
  colors,
  data,
  scale,
  side,
  gender = 'male',
  onBodyPartPress,
  renderCircles,
}: Props) => {
  const mergedBodyParts = useCallback(
    (dataSource: ReadonlyArray<BodyPart>) => {
      const innerData = data
        .map(d => {
          return dataSource.find(t => t.slug === d.slug);
        })
        .filter(Boolean);

      const coloredBodyParts = innerData.map(d => {
        const bodyPart = data.find(e => e.slug === d?.slug);
        let colorIntensity = 1;
        if (bodyPart?.intensity) colorIntensity = bodyPart.intensity;
        return {...d, color: colors[colorIntensity - 1]};
      });

      const formattedBodyParts = differenceWith(comparison, dataSource, data);

      return [...formattedBodyParts, ...coloredBodyParts];
    },
    [data, colors],
  );

  const getColorToFill = (bodyPart: BodyPart) => {
    let color;
    if (bodyPart.intensity) color = colors[bodyPart.intensity];
    else color = bodyPart.color;
    return color;
  };

  const renderBodySvg = (data: ReadonlyArray<BodyPart>) => {
    const SvgWrapper = gender === 'male' ? SvgMaleWrapper : SvgFemaleWrapper;
    return (
      <SvgWrapper side={side} scale={scale}>
        {mergedBodyParts(data).map((bodyPart: BodyPart) => {
          if (bodyPart.pathArray) {
            return bodyPart.pathArray.map((path: string) => {
              return (
                <Path
                  key={path}
                  onPress={() => onBodyPartPress?.(bodyPart)}
                  id={bodyPart.slug}
                  fill={getColorToFill(bodyPart)}
                  d={path}
                />
              );
            });
           
          } else if (bodyPart.type == 'circle') {
            return (
              <Circle
                fill={getColorToFill(bodyPart)}
                onPress={() => onBodyPartPress?.(bodyPart)}
                cx={bodyPart.cx}
                cy={bodyPart.cy}
                r="20"
              />
            );
          }
        })}
      </SvgWrapper>
    );
  };

  if (gender === 'female') {
    return renderBodySvg(side === 'front' ? bodyFemaleFront : bodyFemaleBack);
  }

  return renderBodySvg(side === 'front' ? bodyFront : bodyBack);
};

Body.defaultProps = {
  scale: 1,
  colors: ['#0984e3', '#74b9ff'],
  zoomOnPress: false,
  side: 'front',
};

export default memo(Body);
