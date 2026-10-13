
use palette::Srgb;
use simple_color_gen_lib::get_gradients;

#[test]
fn should_get_gradient() {
    let rgb = Srgb::new(171.0, 193.0, 35.0);
    let colors = get_gradients(rgb);
    assert!(colors.len() > 0);
}
