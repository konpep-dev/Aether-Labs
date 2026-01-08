export type Language = 'el' | 'en';

export const translations = {
  el: {
    hub: {
      subtitle: 'Σουίτα Επιστημονικών Προσομοιώσεων',
      settings: 'Ρυθμίσεις',
      select_language: 'Επιλογή Γλώσσας',
      access_granted: 'ΕΓΚΡΙΣΗ ΠΡΟΣΒΑΣΗΣ',
      close: 'Κλείσιμο',
      // Launcher tabs
      tabs: {
        simulations: 'Προσομοιώσεις',
        docs: 'Οδηγοί',
        settings: 'Ρυθμίσεις',
        about: 'Σχετικά'
      },
      // Simulations page
      simulations_title: 'Διαθέσιμες Προσομοιώσεις',
      simulations_desc: 'Επιλέξτε μια προσομοίωση φυσικής για να εξερευνήσετε',
      open: 'Άνοιγμα',
      // Docs page
      docs_title: 'Τεκμηρίωση',
      docs_desc: 'Μάθετε πώς να χρησιμοποιείτε κάθε προσομοίωση',
      getting_started: 'Ξεκινώντας',
      simulation_guides: 'Οδηγοί Προσομοιώσεων',
      physics_reference: 'Αναφορά Φυσικής',
      // Settings page
      settings_title: 'Ρυθμίσεις',
      settings_desc: 'Προσαρμόστε την εμπειρία σας',
      general: 'Γενικά',
      animations: 'Κινήσεις',
      animations_desc: 'Ενεργοποίηση ομαλών κινήσεων UI',
      high_quality: 'Υψηλή Ποιότητα',
      high_quality_desc: 'Καλύτερα γραφικά, μπορεί να επηρεάσει την απόδοση',
      show_fps: 'Εμφάνιση FPS',
      show_fps_desc: 'Εμφάνιση καρέ ανά δευτερόλεπτο',
      notes_settings: 'Σημειώσεις',
      auto_save: 'Αυτόματη Αποθήκευση',
      auto_save_desc: 'Αυτόματη αποθήκευση σημειώσεων',
      default_author: 'Προεπιλεγμένο Όνομα',
      language: 'Γλώσσα',
      data_management: 'Διαχείριση Δεδομένων',
      export_notes: 'Εξαγωγή Σημειώσεων',
      clear_data: 'Διαγραφή Δεδομένων',
      // About page
      about_title: 'Σχετικά',
      about_desc: 'Το Aether Labs είναι μια διαδραστική πλατφόρμα προσομοιώσεων φυσικής σχεδιασμένη για μαθητές, εκπαιδευτικούς και λάτρεις της επιστήμης.',
      made_in_greece: 'Κατασκευή στην Ελλάδα',
      developed_by: 'Ανάπτυξη από',
      built_with: 'Κατασκευάστηκε με',
      // Footer
      footer_rights: '© 2026 Aether Labs. Με επιφύλαξη παντός δικαιώματος.',
      tools: {
        quadratic: {
          title: 'Διερεύνηση Εξισώσεων',
          desc: 'Προηγμένη ανάλυση δευτεροβάθμιων εξισώσεων, γραφική παράσταση και μιγαδικές ρίζες σε πραγματικό χρόνο.'
        },
        reentry: {
          title: 'Προσομοιωτής Επανεισόδου',
          desc: 'Προσομοιωτής ατμοσφαιρικής επανεισόδου. Υπολογισμός θερμικών φορτίων, G-Force και αεροδυναμικής τριβής.'
        },
        gravity: {
          title: 'Βαρυτικό Πεδίο 3D',
          desc: 'Προσομοίωση N-Body συστημάτων σε 3D. Περιηγηθείτε στο χώρο και δημιουργήστε πλανητικά συστήματα.'
        },
        optics: {
          title: 'Κυματική Οπτική',
          desc: 'Οπτικοποίηση φαινομένων συμβολής κυμάτων. Πείραμα δύο πηγών, μοτίβα περίθλασης και ανάλυση φάσης.'
        }
      }
    },
    quadratic: {
      controls: {
        title: 'ΠΑΡΑΜΕΤΡΟΙ',
        curvature: 'Καμπυλοτητα',
        slope: 'Κλιση',
        offset: 'Μετατοπιση',
        curvature_desc: 'Συντελεστής x²',
        slope_desc: 'Γραμμικός συντελεστής',
        offset_desc: 'Σταθερός όρος'
      },
      chart: {
        title: 'ΓΡΑΦΗΜΑ'
      },
      stats: {
        discriminant: 'Δ (Διακρίνουσα)',
        roots: 'Ρίζες',
        vertex: 'Κορυφή',
        y_intercept: "Τομή με y'y",
        two_roots: 'Δύο άνισες ρίζες',
        one_root: 'Μία διπλή ρίζα',
        complex_roots: 'Συζυγείς μιγαδικές',
        vertex_desc: 'Σημείο Ελαχ./Μεγ.',
        intercept_desc: "Τομή με άξονα y",
        // New advanced stats
        derivative: 'Παράγωγος',
        derivative_desc: "f'(x) = 2ax + b",
        second_derivative: 'Δεύτερη Παράγωγος',
        concavity: 'Κυρτότητα',
        concave_up: 'Κοίλη προς τα πάνω',
        concave_down: 'Κοίλη προς τα κάτω',
        linear_eq: 'Γραμμική',
        area: 'Εμβαδόν',
        area_desc: 'Μεταξύ ριζών',
        focus: 'Εστία',
        directrix: 'Διευθετούσα',
        no_real_area: 'Δεν υπάρχουν πραγματικές ρίζες'
      },
      explanations: {
        title: 'Δεδομένα Συντελεστών',
        shape_control: 'Έλεγχος Σχήματος.',
        opens_up: 'Κοιτάζει πάνω.',
        opens_down: 'Κοιτάζει κάτω.',
        lateral_shift: 'Οριζόντια μετατόπιση.',
        vertical_intercept: 'Κάθετη τομή στο y ='
      },
      solution: {
        log_title: 'Αρχείο Ανάλυσης',
        linear_msg: 'Όταν το a = 0, η εξίσωση γίνεται πρωτοβάθμια.',
        identity: 'Ταυτότητα',
        impossible: 'Αδύνατη',
        title: 'Αναλυτική Λύση',
        step_disc: '01. ΔΙΑΚΡΙΝΟΥΣΑ (Δ)',
        step_formula: '02. ΤΥΠΟΣ',
        step_result: '03. ΑΠΟΤΕΛΕΣΜΑ',
        complex_warn: 'Εντοπίστηκαν μιγαδικές ρίζες.',
        double: 'Διπλή'
      }
    },
    gravity: {
      controls: {
        title: 'Κέντρο Ελέγχου',
        g_constant: 'Σταθερά G',
        time_speed: 'Ροή Χρόνου',
        reset: 'Επαναφορά',
        clear: 'Εκκαθάριση',
        paused: 'ΠΑΥΣΗ',
        running: 'ΕΚΤΕΛΕΣΗ',
        hint: 'Κλικ για Εστίαση | WASD για Κίνηση | Δεξί Κλικ για Βολή',
        display_opts: 'Προβολή',
        physics_opts: 'Φυσική',
        show_trails: 'Ίχνη Τροχιάς',
        show_grid: 'Πλέγμα & Σκιές',
        show_vectors: 'Διανύσματα',
        collisions: 'Συγκρούσεις',
        merge: 'Συγχώνευση',
        bounce: 'Αναπήδηση',
        wasd: 'WASD: Κίνηση | SPACE/SHIFT: Πάνω/Κάτω',
        cam_speed: 'Ταχύτητα Κάμερας',
        launch_settings: 'Ρυθμίσεις Εκτόξευσης',
        mass: 'Μάζα',
        radius: 'Ακτίνα',
        launch_velocity: 'Ταχύτητα Βολής',
        inspector: 'Επιθεωρητής',
        no_selection: 'Κάντε κλικ σε σώμα',
        delete: 'Διαγραφή'
      },
      stats: {
        system_status: 'ΚΑΤΑΣΤΑΣΗ ΣΥΣΤΗΜΑΤΟΣ',
        bodies: 'Σώματα',
        fps: 'FPS',
        energy: 'Ενέργεια',
        velocity: 'Ταχύτητα'
      },
      charts: {
        energy_title: 'Ενεργειακό Ισοζύγιο',
        velocity_title: 'Κατανομή Ταχύτητας',
        kinetic: 'Κινητική (KE)',
        potential: 'Δυναμική (PE)',
        total: 'Ολική',
        max_vel: 'Μέγιστη V',
        avg_vel: 'Μέση V'
      }
    },
    optics: {
      controls: {
        title: 'Παράμετροι Κύματος',
        frequency: 'Συχνότητα (Hz)',
        separation: 'Απόσταση d (px)',
        phase: 'Διαφορά Φάσης φ',
        amplitude: 'Πλάτος A',
        color_mode: 'Χρωματική Παλέτα',
        presets: 'Προεπιλογές',
        preset_young: 'Πείραμα Young',
        preset_wide: 'Ευρεία Συμβολή',
        preset_high_freq: 'Υψίσυχνο'
      },
      analysis: {
        title: 'Ανάλυση Κύματος',
        wavelength: 'Μήκος Κύματος (λ)',
        interference: 'Τύπος Συμβολής',
        profile: 'Κατανομή Έντασης (Cross-section)',
        constructive: 'Ενισχυτική',
        destructive: 'Αποσβεστική'
      },
      modes: {
        interference: 'Standard (Cyan)',
        heatmap: 'Thermal (Heatmap)',
        mono: 'Monochrome'
      }
    }
  },
  en: {
    hub: {
      subtitle: 'Scientific Simulation Suite',
      settings: 'Settings',
      select_language: 'Select Language',
      access_granted: 'ACCESS GRANTED',
      close: 'Close',
      // Launcher tabs
      tabs: {
        simulations: 'Simulations',
        docs: 'Docs',
        settings: 'Settings',
        about: 'About'
      },
      // Simulations page
      simulations_title: 'Available Simulations',
      simulations_desc: 'Choose a physics simulation to explore and experiment with',
      open: 'Open',
      // Docs page
      docs_title: 'Documentation',
      docs_desc: 'Learn how to use each simulation and understand the physics behind them',
      getting_started: 'Getting Started',
      simulation_guides: 'Simulation Guides',
      physics_reference: 'Physics Reference',
      // Settings page
      settings_title: 'Settings',
      settings_desc: 'Customize your Aether Labs experience',
      general: 'General',
      animations: 'Animations',
      animations_desc: 'Enable smooth UI animations',
      high_quality: 'High Quality Graphics',
      high_quality_desc: 'Better visuals, may affect performance',
      show_fps: 'Show FPS Counter',
      show_fps_desc: 'Display frames per second in simulations',
      notes_settings: 'Notes',
      auto_save: 'Auto-save Notes',
      auto_save_desc: 'Automatically save notes while typing',
      default_author: 'Default Author Name',
      language: 'Language',
      data_management: 'Data Management',
      export_notes: 'Export All Notes',
      clear_data: 'Clear All Data',
      // About page
      about_title: 'About',
      about_desc: 'Aether Labs is an interactive physics simulation platform designed for students, educators, and enthusiasts. Explore mathematical concepts and physical phenomena through beautiful, real-time visualizations.',
      made_in_greece: 'Made in Greece',
      developed_by: 'Developed with ❤️ by',
      built_with: 'Built With',
      // Footer
      footer_rights: '© 2026 Aether Labs. All rights reserved.',
      tools: {
        quadratic: {
          title: 'Quadratic Explorer',
          desc: 'Advanced quadratic equation analysis, real-time plotting, and complex root visualization.'
        },
        reentry: {
          title: 'Orbital Reentry Sim',
          desc: 'Atmospheric reentry simulator. Calculation of thermal loads, G-Forces, and aerodynamic drag.'
        },
        gravity: {
          title: 'Gravity Sandbox 3D',
          desc: 'Real 3D N-Body simulation. Fly through space, orbit planets, and construct systems in three dimensions.'
        },
        optics: {
          title: 'Wave Optics',
          desc: 'Visualizer for wave interference phenomena. Two-source experiment, diffraction patterns, and phase analysis.'
        }
      }
    },
    quadratic: {
      controls: {
        title: 'PARAMETERS',
        curvature: 'Curvature',
        slope: 'Slope',
        offset: 'Offset',
        curvature_desc: 'Quadratic coefficient',
        slope_desc: 'Linear coefficient',
        offset_desc: 'Constant term'
      },
      chart: {
        title: 'PLOT VIEW'
      },
      stats: {
        discriminant: 'Δ (Discriminant)',
        roots: 'Roots',
        vertex: 'Vertex',
        y_intercept: 'Y-Intercept',
        two_roots: 'Two distinct roots',
        one_root: 'One double root',
        complex_roots: 'Complex conjugate',
        vertex_desc: 'Min/Max point',
        intercept_desc: 'Intersects y-axis',
        // New advanced stats
        derivative: 'Derivative',
        derivative_desc: "f'(x) = 2ax + b",
        second_derivative: 'Second Derivative',
        concavity: 'Concavity',
        concave_up: 'Concave Up',
        concave_down: 'Concave Down',
        linear_eq: 'Linear',
        area: 'Area',
        area_desc: 'Between roots',
        focus: 'Focus',
        directrix: 'Directrix',
        no_real_area: 'No real roots'
      },
      explanations: {
        title: 'Coefficient Data',
        shape_control: 'Shape Control.',
        opens_up: 'Opens Upward.',
        opens_down: 'Opens Downward.',
        lateral_shift: 'Lateral Shift.',
        vertical_intercept: 'Vertical Intercept at y ='
      },
      solution: {
        log_title: 'Analysis Log',
        linear_msg: 'When a = 0, the equation becomes linear.',
        identity: 'Identity',
        impossible: 'Impossible',
        title: 'Analytical Solution',
        step_disc: '01. DISCRIMINANT (Δ)',
        step_formula: '02. FORMULA',
        step_result: '03. RESULT',
        complex_warn: 'Complex roots detected.',
        double: 'Double'
      }
    },
    gravity: {
      controls: {
        title: 'Control Center',
        g_constant: 'G Constant',
        time_speed: 'Time Flow',
        reset: 'Reset',
        clear: 'Clear',
        paused: 'PAUSED',
        running: 'RUNNING',
        hint: 'Click to Focus | WASD to Move | Right Click to Shoot',
        display_opts: 'Visuals',
        physics_opts: 'Physics',
        show_trails: 'Orbital Trails',
        show_grid: 'Grid & Shadows',
        show_vectors: 'Velocity Vectors',
        collisions: 'Collisions',
        merge: 'Merge',
        bounce: 'Elastic Bounce',
        wasd: 'WASD: Move | SPACE/SHIFT: Up/Down',
        cam_speed: 'Camera Speed',
        launch_settings: 'Launch Settings',
        mass: 'Mass',
        radius: 'Radius',
        launch_velocity: 'Launch Force',
        inspector: 'Object Inspector',
        no_selection: 'Click a body to inspect',
        delete: 'Delete'
      },
      stats: {
        system_status: 'SYSTEM STATUS',
        bodies: 'Active Bodies',
        fps: 'FPS',
        energy: 'Energy',
        velocity: 'Velocity'
      },
      charts: {
        energy_title: 'Energy Balance',
        velocity_title: 'Velocity Distribution',
        kinetic: 'Kinetic (KE)',
        potential: 'Potential (PE)',
        total: 'Total',
        max_vel: 'Max V',
        avg_vel: 'Avg V'
      }
    },
    optics: {
      controls: {
        title: 'Wave Parameters',
        frequency: 'Frequency (Hz)',
        separation: 'Separation d (px)',
        phase: 'Phase Shift φ',
        amplitude: 'Amplitude A',
        color_mode: 'Color Map',
        presets: 'Presets',
        preset_young: "Young's Exp.",
        preset_wide: 'Wide Field',
        preset_high_freq: 'High Freq'
      },
      analysis: {
        title: 'Wave Analysis',
        wavelength: 'Wavelength (λ)',
        interference: 'Interference Type',
        profile: 'Intensity Profile (Cross-section)',
        constructive: 'Constructive',
        destructive: 'Destructive'
      },
      modes: {
        interference: 'Standard (Cyan)',
        heatmap: 'Thermal (Heatmap)',
        mono: 'Monochrome'
      }
    }
  }
};