import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ColorScheme } from '../app/_layout';

export const StepProgress = ({ totalSteps, currentStep, onStepPress }) => {
  return (
    <View style={styles.container}>
      {Array.from({ length: totalSteps }).map((_, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber <= currentStep;
        const isLast = index === totalSteps - 1;

        return (
          <React.Fragment key={index}>
            <TouchableOpacity
              onPress={() => onStepPress?.(stepNumber)}
              style={[
                styles.step,
                isActive ? styles.stepActive : styles.stepInactive
              ]}
            />
            {!isLast && (
              <View

              
                style={[
                  styles.line,
                  stepNumber < currentStep ? [styles.progressFill ,{ width: `${Math.min((30 / 100) * 100, 100)}%` }] : styles.lineInactive
                ]}
                  

              //style={{styles.lineActive}}

              />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
};

// Example usage component
/*
export default function App() {
  const [currentStep, setCurrentStep] = useState(4);

  return (
    <View style={styles.app}>
      <StepProgress
        totalSteps={3}
        currentStep={currentStep}
        onStepPress={setCurrentStep}
      />
    </View>
  );
}
*/
const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: '#2d2d2d',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  step: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
  },
  stepActive: {
    backgroundColor: ColorScheme.accent,
    borderColor: ColorScheme.accent,
  },
  stepInactive: {
    backgroundColor: 'transparent',
    borderColor: '#666',
  },
  line: {
    height: 2,
    flex: 1,
    marginHorizontal: 4,
  },
  lineActive: {
    backgroundColor: ColorScheme.accent,
  },
  lineInactive: {
    backgroundColor: '#615e5eff',
  },
  progressFill: {
        //height: '300%',
        backgroundColor: "#00fd61ff"  , //accent
        height: 2,
        flex: 1,
        marginHorizontal:4
        //borderRadius: getResponsiveSize(2),
    },
});