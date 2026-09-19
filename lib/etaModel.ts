import * as tf from '@tensorflow/tfjs';

// Train a lightweight linear regression model for ETA prediction
export async function predictSmartETA(distanceKm: number, currentHour: number, isPeakHour: boolean): Promise<number> {
  let model: tf.Sequential | null = null;
  try {
    model = tf.sequential();
    model.add(tf.layers.dense({ units: 8, activation: 'relu', inputShape: [3] }));
    model.add(tf.layers.dense({ units: 1 }));

    model.compile({ optimizer: 'sgd', loss: 'meanSquaredError' });

    const xs = tf.tensor2d([
      [2.5, 9, 1],  
      [5.0, 14, 0], 
      [8.2, 18, 1], 
      [1.0, 22, 0], 
    ]);

    const ys = tf.tensor2d([[18], [12], [35], [3]]);

    await model.fit(xs, ys, { epochs: 20, verbose: 0 });

    const congestionFactor = isPeakHour ? 1.8 : 1.0;
    const inputTensor = tf.tensor2d([[distanceKm, currentHour, isPeakHour ? 1 : 0]]);
    const prediction = model.predict(inputTensor) as tf.Tensor;
    const predictedMinutes = await prediction.data();

    tf.dispose([xs, ys, inputTensor, prediction]);
    if (model) {
      model.dispose();
    }

    const finalEta = Math.max(2, Math.round(predictedMinutes[0] * congestionFactor));
    return finalEta;
  } catch (err) {
    console.error("TF.js prediction error, falling back to heuristic:", err);
    if (model) {
      model.dispose();
    }
    return Math.round(distanceKm * 4.5);
  }
}