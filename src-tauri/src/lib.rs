use palette::{Lch, Srgb, convert::FromColorUnclamped};
use serde::{Deserialize, Serialize};

#[tauri::command]
fn generate_gradient(color: RgbColor) -> Vec<RgbColor> {
    let rgb = Srgb::new(
        color.r as f32 / 255.0,
        color.g as f32 / 255.0,
        color.b as f32 / 255.0,
    );
    let lch = Lch::from_color_unclamped(rgb.into_linear());
    let lightness_arr = [97.0, 90.0, 82.0, 74.0, 66.0, 58.0, 50.0, 42.0, 34.0, 26.0];
    let colors: Vec<RgbColor> = lightness_arr
        .iter()
        .map(|&lightness| {
            let shade = Lch::new(lightness, lch.chroma, lch.hue);
            let rgb: Srgb<u8> = Srgb::from_color_unclamped(shade).into_format();
            RgbColor {
                r: rgb.red,
                g: rgb.green,
                b: rgb.blue,
            }
        })
        .collect();
    colors
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![generate_gradient])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[derive(Debug, Serialize, Deserialize)]
struct RgbColor {
    r: u8,
    g: u8,
    b: u8,
}
