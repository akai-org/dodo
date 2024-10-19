import styles from './ThemeFold.module.scss';

import { colors } from './ThemesFold.utils.ts';
import Settings from "../../../components/settings/Settings.tsx";
import useThemeStore from "../../../store/theme/theme.store.ts";

const ThemesFold = () => {

    const {theme, setTheme} = useThemeStore()

    const handleModeChange = () => {
        setTheme({
            ...theme,
            mode: theme.mode === 'light' ? 'dark' : 'light',
        });
    };

    const handleStyleChange = (name: string) => {
        setTheme({
            ...theme,
            style: name
        });
    };

    const capitalize = (seq: string) => {
        return seq.charAt(0).toUpperCase() + seq.slice(1);
    }

    const colorPalettes = colors.map(
        ({
             name,
             primaryColor,
             secondaryColor,
             thirdColor,
             additionalColor,
         }) => (
            <div
                key={name}
                className={styles.paletteElement}
                onClick={() => handleStyleChange(name)}
            >
                <p className={styles.paletteName}>
                    {capitalize(name)}
                </p>
                <div
                    style={{ backgroundColor: additionalColor }}
                    className={styles.firstLayer}
                >
                    <div
                        style={{ backgroundColor: thirdColor }}
                        className={styles.secondLayer}
                    >
                        <div
                            style={{ backgroundColor: secondaryColor }}
                            className={styles.thirdLayer}
                        >
                            <div
                                style={{ backgroundColor: primaryColor }}
                                className={styles.fourthLayer}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>
        ),
    );

    return (
        <Settings>
            <div className={styles.container}>
                <div className={styles.modeContainer}>
                    <p className={styles.modeText}>MODE</p>
                    <label className={styles.switch}>
                        <div
                            className={styles.modeToggle}
                            onClick={handleModeChange}
                            role="button"
                        >
                            {theme.mode === 'light' ? 'LIGHT' : 'DARK'}
                        </div>
                    </label>
                </div>
                <hr className={styles.line} />
                <div className={styles.themesContainer}>{colorPalettes}</div>
            </div>
        </Settings>
    );
};

export default ThemesFold;